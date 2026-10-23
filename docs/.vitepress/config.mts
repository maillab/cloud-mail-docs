import {defineConfig} from 'vitepress'

export default defineConfig({
    locales: {
        root: {
            head: [
                [
                    'link',
                    { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' }
                ]
            ],
            label: '中文简体',
            lang: 'zh',
            themeConfig: {
                siteTitle: 'Cloud Mail',
                logo: '/images/logo.png',
                nav: [
                    {text: '首页', link: '/'},
                    {text: '文档', link: '/guide/quick-start'},
                    {text: '捐助 ❤️', link: '/support'},
                    {text: 'v3.3.0', link: 'https://github.com/maillab/cloud-mail/releases'}
                ],

                sidebar: [
                    {
                        text: '指南',
                        items: [
                            {text: '快速开始', link: '/guide/quick-start'},
                        ]
                    },
                    {
                        text: '部署教程',
                        items: [
                            {text: '界面部署', link: '/deployment/dashboard'},
                            {text: 'GitHub Action 部署', link: '/deployment/action'},
                            {text: '命令部署', link: '/deployment/command'},
                            {text: '项目更新', link: '/deployment/update'}
                        ]
                    },
                    {
                        text: '环境配置',
                        items: [
                            {text: '更多变量', link: '/environment/more-variables'},
                        ]
                    },
                    {
                        text: '邮件发送',
                        items: [
                            {text: 'Resend', link: '/sending/resend'},
                            {text: 'Cloudflare', link: '/sending/cloudflare'},
                        ]
                    },
                    {
                        text: '系统设置',
                        items: [
                            {text: '对象存储', link: '/system/object-storage'},
                            {text: 'Turnstile', link: '/system/turnstile'},
                            {text: '邮件转发', link: '/system/forward'},
                            {text: 'Oauth2', link: '/system/oauth2'},
                        ]
                    },
                    {
                        text: 'API 接口',
                        items: [
                            {text: '接口文档', link: '/api/api-doc'},
                        ]
                    },
                    {
                        text: '捐助 ❤️', link: '/support'
                    },
                    {
                        text: '联系', link: '/contact'
                    }
                ],

                outline: {
                    level: [2, 3]
                },

                socialLinks: [
                    {icon: 'github', link: 'https://github.com/maillab/cloud-mail'},
                    {icon: 'telegram', link: 'https://t.me/cloud_mail_tg'}
                ]
            }
        },
        en: {
            head: [
                [
                    'link',
                    { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' }
                ]
            ],
            label: 'English',
            lang: 'en',
            link: '/en/',
            themeConfig: {
                siteTitle: 'Cloud Mail',
                logo: '/images/logo.png',
                nav: [
                    { text: 'Home', link: '/en/' },
                    { text: 'Document', link: '/en/guide/quick-start' },
                    { text: 'Sponsor ️ ❤️', link: '/en/support' },
                    {text: 'v3.3.0', link: 'https://github.com/maillab/cloud-mail/releases'}
                ],

                sidebar: [
                    {
                        text: 'Guide',
                        items: [
                            { text: 'Quick Start', link: '/en/guide/quick-start' },
                        ]
                    },
                    {
                        text: 'Deployment Guide',
                        items: [
                            { text: 'Dashboard', link: '/en/deployment/dashboard'},
                            { text: 'GitHub Action', link: '/en/deployment/action' },
                            { text: 'Command', link: '/en/deployment/command' },
                            { text: 'Project Updates', link: '/en/deployment/update' }
                        ]
                    },
                    {
                        text: 'Environment',
                        items: [
                            { text: 'More Variables', link: '/en/environment/more-variables' },
                        ]
                    },
                    {
                        text: 'Email Sending',
                        items: [
                            { text: 'Resend', link: '/en/sending/resend' },
                            { text: 'Cloudflare', link: '/en/sending/cloudflare' },
                        ]
                    },
                    {
                        text: 'System Settings',
                        items: [
                            {text: 'Object Storage', link: '/en/system/object-storage'},
                            {text: 'Turnstile', link: '/en/system/turnstile'},
                            {text: 'Email Forwarding', link: '/en/system/forward'}
                        ]
                    },
                    {
                        text: 'API',
                        items: [
                            { text: 'API Document', link: '/en/api/api-doc' },
                        ]
                    },
                    {
                        text: 'Sponsor ❤️', link: '/en/support'
                    },
                    {
                        text: 'Contact', link: '/en/contact'
                    }
                ],

                outline: {
                    level: [2, 3]
                },

                socialLinks: [
                    { icon: 'github', link: 'https://github.com/maillab/cloud-mail' },
                    { icon: 'telegram', link: 'https://t.me/cloud_mail_tg'}
                ]
            }
        }
    },
    title: "Cloud Mail",
    description: "Cloud Mail"
})
