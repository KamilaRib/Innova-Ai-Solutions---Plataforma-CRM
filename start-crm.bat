@echo off
echo ==========================================
echo    INICIANDO CRM INNOVA AI (LOCAL)
echo ==========================================

:: Iniciar o Backend
echo [1/2] Iniciando Backend na porta 5000...
start cmd /k "cd backend && npm run dev"

:: Iniciar o Frontend
echo [2/2] Iniciando Frontend na porta 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo    TUDO PRONTO!
echo    ABRINDO CRM NO NAVEGADOR...
echo    CRM: http://localhost:5173
echo    (Evolution API rodando na VPS Hostinger)
echo ==========================================
start http://localhost:5173
pause
