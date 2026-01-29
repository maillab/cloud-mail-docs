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
                    {text: '文档', link: '/preview/description'},
                    {text: '捐助 ❤️', link: '/support'},
                    {text: 'v2.8.0', link: 'https://github.com/maillab/cloud-mail/releases'}
                ],

                sidebar: [
                    {
                        text: '项目预览',
                        items: [
                            {text: '项目介绍', link: '/preview/description'},
                            {text: '更新日志', link: 'https://github.com/maillab/cloud-mail/releases'},
                        ]
                    },
                    {
                        text: '部署教程',
                        items: [
                            {text: '界面部署', link: '/guide/dashboard'},
                            {text: 'Action 部署', link: '/guide/action'},
                            {text: '命令部署', link: '/guide/command'},
                            {text: '项目更新', link: '/guide/update'}
                        ]
                    },
                    {
                        text: '系统设置',
                        items: [
                            {text: '邮件发送', link: '/system/sending'},
                            {text: '对象存储', link: '/system/object-storage'},
                            {text: 'Turnstile', link: '/system/turnstile'},
                            {text: '邮件转发', link: '/system/forward'},

                        ]
                    },
                    {
                        text: '第三方登录',
                        items: [
                            {text: 'LinuxDo', link: '/oauth2/linuxdo.md'},
                        ]
                    },
                    {
                        text: '开放 API',
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
                    { text: 'Document', link: '/en/preview/description' },
                    { text: 'Support ️ ❤️', link: '/en/support' },
                    {text: 'v2.8.0', link: 'https://github.com/maillab/cloud-mail/releases'}
                ],

                sidebar: [
                    {
                        text: 'Project Preview',
                        items: [
                            { text: 'Description', link: '/en/preview/description' },
                            { text: 'Changelog', link: 'https://github.com/maillab/cloud-mail/releases' },
                        ]
                    },
                    {
                        text: 'Deployment Guide',
                        items: [
                            { text: 'Dashboard Deployment', link: '/en/guide/dashboard'},
                            { text: 'Action Deployment', link: '/en/guide/action' },
                            { text: 'Command Deployment', link: '/en/guide/command' },
                            { text: 'Project Updates', link: '/en/guide/update' }
                        ]
                    },
                    {
                        text: 'System Settings',
                        items: [
                            {text: 'Email Sending', link: '/en/system/sending'},
                            {text: 'Object Storage', link: '/en/system/object-storage'},
                            {text: 'Turnstile', link: '/en/system/turnstile'},
                            {text: 'Email Forwarding', link: '/en/system/forward'},

                        ]
                    },
                    {
                        text: 'Open API',
                        items: [
                            { text: 'Document', link: '/en/api/api-doc' },
                        ]
                    },
                    {
                        text: 'Support ❤️', link: '/en/support'
                    },
                    {
                        text: 'Contact', link: '/en/contact'
                    }
                ],

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
