// Social Media API Configuration
// This file contains placeholder configurations for social media API credentials
// Replace these placeholder values with your actual API keys and tokens

// Types for API configurations
interface SocialMediaConfig {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    accessTokenSecret?: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    [key: string]: string | undefined; // For any additional platform-specific keys
  }
  
  // Export the social media configurations
  const socialMediaConfig: Record<string, SocialMediaConfig> = {
    // Twitter (X) API Configuration
    twitter: {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
      bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    },
    
    // Facebook API Configuration
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || '',
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
      pageId: process.env.FACEBOOK_PAGE_ID || '',
    },
    
    // LinkedIn API Configuration
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
      redirectUri: process.env.LINKEDIN_REDIRECT_URI || '',
    },
    
    // Instagram API Configuration (part of Facebook Graph API)
    instagram: {
      appId: process.env.INSTAGRAM_APP_ID || '',
      appSecret: process.env.INSTAGRAM_APP_SECRET || '',
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
      userId: process.env.INSTAGRAM_USER_ID || '',
    },
    
    // TikTok API Configuration
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
      accessToken: process.env.TIKTOK_ACCESS_TOKEN || '',
    },
    
    // YouTube API Configuration
    youtube: {
      apiKey: process.env.YOUTUBE_API_KEY || '',
      clientId: process.env.YOUTUBE_CLIENT_ID || '',
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
      refreshToken: process.env.YOUTUBE_REFRESH_TOKEN || '',
    },
  };
  
  export default socialMediaConfig;