# 🎓 UniCraft Waitlist

A beautiful waitlist page with Google OAuth authentication for UniCraft - a mentorship platform connecting students with mentors.

## ✨ Features

- 🔐 **Google OAuth Authentication** - One-click sign-in
- 📧 **Email-only Registration** - Simple user onboarding
- 🎨 **Beautiful UI** - Modern, responsive design
- 🎉 **Animated Success Page** - Celebratory user experience
- 🚀 **Production Ready** - Easy deployment to free hosting

## 🏗️ Architecture

- **Frontend**: Pure HTML/CSS/JavaScript (static files)
- **Backend**: Django REST API with JWT authentication
- **Database**: SQLite (can be upgraded to PostgreSQL)
- **Authentication**: Google OAuth 2.0

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Google Cloud Console account
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/unicraft-waitlist.git
   cd unicraft-waitlist
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Setup Frontend**
   ```bash
   cd Frontend/waitlist
   python server.py
   ```

4. **Configure Google OAuth**
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Update `Backend/unimentor/settings.py` with your credentials
   - Update `Frontend/waitlist/index.html` with your Client ID

5. **Test the flow**
   - Go to `http://localhost:3000`
   - Click "Join Waitlist with Google"
   - Complete authentication
   - See congratulations page

## 🌐 Production Deployment

### Free Hosting Options

- **Backend**: [Render.com](https://render.com) (Free tier: 750 hours/month)
- **Frontend**: [Netlify](https://netlify.com) (Free tier: 100GB bandwidth/month)

### Deployment Steps

1. **Upload to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy Backend to Render**
   - Connect GitHub repository
   - Select `Backend` folder
   - Set environment variables
   - Deploy

3. **Deploy Frontend to Netlify**
   - Connect GitHub repository
   - Set base directory to `Frontend/waitlist`
   - Deploy

4. **Update Google Console**
   - Add production redirect URIs
   - Update authorized origins

📖 **See [PRODUCTION_DEPLOYMENT_PLAN.md](PRODUCTION_DEPLOYMENT_PLAN.md) for detailed instructions**

## 🔧 Configuration

### Environment Variables (Production)

```bash
ENVIRONMENT=production
SECRET_KEY=your-secret-key
GOOGLE_OAUTH2_CLIENT_ID=your-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-client-secret
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

### Google Cloud Console Setup

1. Create OAuth 2.0 Client ID
2. Add authorized redirect URIs:
   - Development: `http://localhost:8000/api/users/auth/google/callback/`
   - Production: `https://your-backend.onrender.com/api/users/auth/google/callback/`
3. Add authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Production: `https://your-frontend.netlify.app`

## 📁 Project Structure

```
UniCraft/
├── Backend/                 # Django API
│   ├── users/              # User management & OAuth
│   ├── unimentor/          # Django settings
│   ├── requirements.txt    # Python dependencies
│   └── manage.py
├── Frontend/
│   └── waitlist/           # Static frontend
│       ├── index.html      # Main waitlist page
│       ├── congrats.html   # Success page
│       ├── auth/           # OAuth callback
│       └── styles.css      # Styling
├── PRODUCTION_DEPLOYMENT_PLAN.md
└── README.md
```

## 🎯 User Flow

1. **User visits waitlist page**
2. **Clicks "Join Waitlist with Google"**
3. **Completes Google OAuth**
4. **Gets registered as student**
5. **Sees congratulations page with animations**

## 🔒 Security Features

- JWT token authentication
- CORS protection
- Environment-based configuration
- Secure OAuth flow
- Input validation

## 📊 Monitoring

- Render provides backend logs and monitoring
- Netlify provides frontend analytics
- Google OAuth provides usage statistics

## 🛠️ Development

### Adding Features

1. **Backend**: Add new endpoints in Django apps
2. **Frontend**: Update HTML/CSS/JavaScript
3. **Database**: Create migrations for model changes

### Testing

```bash
# Backend tests
cd Backend
python manage.py test

# Frontend testing
# Open browser and test manually
```

## 📞 Support

- Check logs in Railway dashboard for backend issues
- Check Netlify build logs for frontend issues
- Verify Google Console configuration for OAuth issues

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Ready to launch your waitlist? Follow the production deployment plan and go live in minutes!** 🚀
