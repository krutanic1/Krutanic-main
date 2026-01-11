# Docker Installation Checklist

## Pre-Installation
- [ ] Close all important applications
- [ ] Save all your work
- [ ] Have admin rights on your PC

## Installation Steps
1. [ ] Downloaded Docker Desktop Installer.exe from docker.com
2. [ ] Ran installer as Administrator
3. [ ] Selected "Use WSL 2 instead of Hyper-V"
4. [ ] Installation completed
5. [ ] Clicked "Close and log out"
6. [ ] **RESTARTED COMPUTER** ← Critical!

## Post-Installation Verification
7. [ ] Opened Docker Desktop from Start Menu
8. [ ] Accepted service agreement
9. [ ] Skipped tutorial
10. [ ] Docker Desktop shows green "running" status

## Verify Installation (Run in PowerShell)
```powershell
docker --version
docker-compose --version
```

Expected output:
```
Docker version 24.x.x, build xxxxx
Docker Compose version v2.x.x
```

## Ready to Start Services
```powershell
cd c:\Users\tejor\Downloads\krutanic-main\krutanic-main
docker-compose up --build
```

## What This Will Do:
✅ Build Python 3.10 container (fixes numpy issue)
✅ Install all Python dependencies correctly
✅ Start Redis cache server
✅ Start Node.js backend
✅ Create network between all services
✅ Enable health checks
✅ Set up auto-restart policies

## Expected Startup Time:
- First build: 3-5 minutes (downloads images, builds container)
- Subsequent starts: 10-30 seconds

## Success Indicators:
```
✅ krutanic-redis         ... running
✅ krutanic-python-scraper ... running (healthy)
✅ krutanic-backend        ... running
```

## Then Test:
- Backend: http://localhost:5000
- Python Scraper: http://localhost:8001
- Frontend: http://localhost:5173 (start separately)

---

**Come back once Docker Desktop is installed and showing green status!**
