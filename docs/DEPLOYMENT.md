
# Deployment Guide

## Overview

This guide covers deploying the Delivery Route Optimization & Simulation Platform to production environments. The application uses a modern serverless architecture with the following components:

- **Frontend**: React application (Vercel/Netlify)
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: PostgreSQL on Supabase
- **Authentication**: Supabase Auth (JWT-based)

## Prerequisites

- GitHub account with repository access
- Supabase account and project
- Vercel account (for frontend deployment)
- Domain name (optional, for custom domain)

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details:
   - Name: `delivery-optimization`
   - Database Password: (generate secure password)
   - Region: Choose closest to your users
4. Wait for project initialization (2-3 minutes)

### 2. Configure Database Schema

The database schema is automatically set up through migrations. Key tables include:

- `drivers` - Driver information and status
- `routes` - Delivery route configurations
- `orders` - Delivery order management
- `simulation_results` - Historical simulation data

### 3. Enable Row Level Security (RLS)

RLS policies are automatically configured to ensure:
- Users can only access their own simulation results
- Manager role verification for sensitive operations
- Data isolation between different user sessions

### 4. Set Up Authentication

1. Go to Authentication → Settings in Supabase Dashboard
2. Configure Auth providers (Email/Password enabled by default)
3. Set up email templates for password reset, etc.
4. Configure JWT settings (default settings work for most cases)

## Backend Deployment (Supabase Edge Functions)

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login and Link Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy delivery-simulation
```

### 4. Configure Function Secrets

Set up environment variables for Edge Functions:

```bash
# Set service role key (for database access)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Add any additional secrets as needed
supabase secrets set CUSTOM_API_KEY="your_api_key"
```

## Frontend Deployment (Vercel)

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: React
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 2. Configure Environment Variables

In Vercel dashboard, go to Project Settings → Environment Variables:

```env
# Supabase Configuration (Production)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Optional: Custom domain configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (2-3 minutes)
3. Test the deployment URL

### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains in Vercel
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate generation

## Alternative Deployment: Netlify

### 1. Build Settings

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Environment Variables

In Netlify dashboard, go to Site Settings → Environment Variables:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

## Monitoring & Maintenance

### 1. Database Monitoring

- Monitor database performance in Supabase Dashboard
- Set up alerts for high CPU/memory usage
- Regular backup verification

### 2. Edge Function Logs

```bash
# View function logs
supabase functions logs delivery-simulation

# Follow real-time logs
supabase functions logs delivery-simulation --follow
```

### 3. Frontend Monitoring

- Monitor build status and deployment logs in Vercel
- Set up uptime monitoring (e.g., Pingdom, UptimeRobot)
- Configure error tracking (e.g., Sentry)

### 4. Performance Optimization

- Monitor Core Web Vitals in Vercel Analytics
- Optimize images and assets
- Implement caching strategies

## Security Checklist

### Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ API keys properly configured
- ✅ Database backups enabled
- ✅ SSL/TLS encryption enforced

### Authentication Security
- ✅ JWT token validation
- ✅ Manager role verification
- ✅ Session timeout configured
- ✅ Password strength requirements

### API Security
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ Error handling without data leakage

### Frontend Security
- ✅ Environment variables secured
- ✅ No sensitive data in client-side code
- ✅ HTTPS enforced
- ✅ Content Security Policy configured

## Backup & Recovery

### Database Backups

Supabase provides automatic backups:
- Daily backups retained for 7 days (Free tier)
- Point-in-time recovery available (Pro tier)
- Manual backup triggers available

### Code Backups

- GitHub repository serves as code backup
- Multiple deployment environments (staging/production)
- Version control with Git tags for releases

## Scaling Considerations

### Database Scaling

- Monitor connection pool usage
- Implement read replicas if needed
- Consider database indexing optimization

### Edge Function Scaling

- Automatic scaling handled by Supabase
- Monitor function execution time and memory usage
- Implement caching where appropriate

### Frontend Scaling

- CDN automatically provided by Vercel/Netlify
- Consider implementing service workers for offline support
- Optimize bundle size with code splitting

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Monitor connection pool usage

3. **Authentication Problems**
   - Verify JWT configuration
   - Check user roles and permissions
   - Review auth provider settings

4. **API Errors**
   - Check Edge Function logs
   - Verify input validation
   - Monitor error rates and patterns

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- Project-specific support via GitHub Issues

## Maintenance Schedule

### Weekly
- Review application logs
- Monitor performance metrics
- Check for security updates

### Monthly
- Update dependencies
- Review and optimize database queries
- Analyze user feedback and metrics

### Quarterly
- Security audit and penetration testing
- Performance optimization review
- Backup and recovery testing
