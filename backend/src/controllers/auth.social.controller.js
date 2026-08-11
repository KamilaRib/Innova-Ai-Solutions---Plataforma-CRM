const prisma = require('../lib/prisma');
const crypto = require('crypto');

// Fake/Mock URLs since we don't have real Client IDs from the user yet.
// These will be replaced by process.env.TIKTOK_CLIENT_ID etc in production.
const OAUTH_CONFIG = {
  tiktok: {
    auth_url: 'https://www.tiktok.com/v2/auth/authorize/',
    client_key: process.env.TIKTOK_CLIENT_KEY || 'MOCK_KEY',
  },
  facebook: {
    auth_url: 'https://www.facebook.com/v17.0/dialog/oauth',
    client_id: process.env.FACEBOOK_CLIENT_ID || 'MOCK_KEY',
  },
  instagram: {
    auth_url: 'https://api.instagram.com/oauth/authorize',
    client_id: process.env.INSTAGRAM_CLIENT_ID || 'MOCK_KEY',
  }
};

const generateAuthUrl = async (req, res) => {
  try {
    const { provider } = req.params;
    const config = OAUTH_CONFIG[provider.toLowerCase()];

    if (!config) {
      return res.status(400).json({ error: 'Provedor não suportado' });
    }

    // Generate a state token to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString('hex');
    
    // In a real scenario, this redirect URI must match exactly what is registered in the Developer Console
    const redirect_uri = `http://localhost:3000/api/social-auth/${provider}/callback`;

    let url = '';
    if (provider === 'tiktok') {
      url = `${config.auth_url}?client_key=${config.client_key}&response_type=code&scope=user.info.basic,video.publish,video.upload&redirect_uri=${redirect_uri}&state=${state}`;
    } else if (provider === 'facebook') {
      url = `${config.auth_url}?client_id=${config.client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=pages_manage_posts,pages_read_engagement`;
    } else if (provider === 'instagram') {
      url = `${config.auth_url}?client_id=${config.client_id}&redirect_uri=${redirect_uri}&scope=instagram_basic,instagram_content_publish&response_type=code&state=${state}`;
    }

    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating auth url:', error);
    res.status(500).json({ error: 'Failed to generate auth url' });
  }
};

const handleCallback = async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`http://localhost:5173/app/social/hub?error=${error}`);
    }

    // TODO: Phase 2 - Actually exchange the 'code' for an 'access_token' via HTTP request to the provider's API.
    // For now, we simulate a successful connection and save a mock token.
    
    const mockAccessToken = `mock_token_${crypto.randomBytes(8).toString('hex')}`;

    // Normally we would have the user_id in the session/state, but for this callback which comes from an external browser redirect, 
    // we would encode the user_id inside the 'state' parameter or use a temporary session store.
    // For this mock, we'll just upsert an integration record.
    
    await prisma.integration.create({
      data: {
        provider: provider.toUpperCase(),
        status: 'CONNECTED',
        credentials: {
          access_token: mockAccessToken,
          refresh_token: 'mock_refresh_token',
          expires_in: 3600
        }
      }
    });

    // Redirect the user back to the React app with a success flag
    res.redirect(`http://localhost:5173/app/social/hub?success=true&provider=${provider}`);
  } catch (error) {
    console.error('Error handling callback:', error);
    res.redirect(`http://localhost:5173/app/social/hub?error=server_error`);
  }
};

module.exports = {
  generateAuthUrl,
  handleCallback
};
