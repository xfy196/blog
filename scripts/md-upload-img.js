import fs from "fs";
import path from "path";
import matter from "gray-matter";
import upyun from "upyun";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
/**
 * 读取docs目录下所有.md文件，找到origin为weixin的文件并提取其中的图片地址
 */
function findImagesInWeixinPosts() {
    const docsPath = path.join(import.meta.dirname, '../docs');
    const images = [];

    // 递归读取docs目录下的所有.md文件
    function readMarkdownFiles(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            // 跳过 .vitepress 目录
            if (stat.isDirectory() && file === '.vitepress') {
                continue;
            }

            if (stat.isDirectory()) {
                readMarkdownFiles(filePath);
            } else if (path.extname(file) === '.md' && stat.isFile()) {
                const content = fs.readFileSync(filePath, 'utf-8');

                // 解析 frontmatter
                const { data: frontmatter, content: markdownContent } = matter(content);

                // 检查 origin 是否为 weixin
                if (frontmatter.origin === 'weixin') {
                    console.log(`处理文件: ${filePath}`);

                    // 使用正则表达式提取 Markdown 中的图片地址
                    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
                    let match;

                    while ((match = imageRegex.exec(markdownContent)) !== null) {
                        const imageUrl = match[2]; // 图片 URL 在第二个捕获组
                        images.push({
                            file: filePath,
                            imageUrl: imageUrl
                        });
                    }

                    // 查找 HTML img 标签格式的图片
                    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
                    while ((match = htmlImageRegex.exec(markdownContent)) !== null) {
                        const imageUrl = match[1];
                        images.push({
                            file: filePath,
                            imageUrl: imageUrl
                        });
                    }
                }
            }
        }
    }

    readMarkdownFiles(docsPath);

    return images;
}

/**
 * 从URL获取文件扩展名
 */
function getFileExtension(url) {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const ext = path.extname(pathname).toLowerCase();
    return ext || '';
}

/**
 * 上传图片到又拍云
 */
async function uploadImageToUpyun(imageUrl, service, operator, password) {
    try {
        // 创建又拍云客户端
        const client = new upyun.Client(
            new upyun.Service(service, operator, password)
        );

        // 获取图片数据
        console.log(`正在下载图片: ${imageUrl}`);
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000 // 30秒超时
        });

        // 生成保存路径
        const fileExt = getFileExtension(imageUrl);
        const fileName = `${uuidv4()}${fileExt}`;
        const date = new Date();
        const savePath = `/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${fileName}`;

        console.log(`正在上传图片到又拍云: ${savePath}`);

        // 上传文件
        const result = await client.putFile(savePath, response.data, {
            'Content-Type': response.headers['content-type'] || 'application/octet-stream'
        });

        console.log(`上传成功: ${savePath}`);
        return {
            originalUrl: imageUrl,
            upyunUrl: `https://static.xxytime.top${savePath}`,
            savePath: savePath
        };
    } catch (error) {
        console.error(`上传失败: ${imageUrl}`, error.message);
        return null;
    }
}

/**
 * 批量上传图片到又拍云
 */
async function uploadImagesToUpyun(images, service, operator, password) {
    const results = [];

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        console.log(`\n[${i + 1}/${images.length}] 正在处理: ${img.imageUrl}`);

        const result = await uploadImageToUpyun(img.imageUrl, service, operator, password);
        if (result) {
            results.push({
                ...result,
                sourceFile: img.file
            });
        }
    }

    return results;
}

// 主函数
async function main() {
    // 获取命令行参数 - 又拍云配置
    const service = process.argv[2] || "xfy-image-bed";  // 服务名
    const operator = process.argv[3] || 'xfy196'; // 操作员
    const password = process.argv[4] || '0gCcZJz56on0pzCcPRu2xX2mhwSp1x1J'; // 密码

    if (!service || !operator || !password) {
        console.log('使用方法: node md-upload-img.js <服务名> <操作员> <密码>');
        console.log('例如: node md-upload-img.js mybucket myoperator mypassword');
        return;
    }

    console.log('开始查找微信文章中的图片...');
    const weixinImages = findImagesInWeixinPosts();

    console.log(`\n总共找到 ${weixinImages.length} 个图片地址`);
    if (weixinImages.length === 0) {
        console.log('没有找到需要上传的图片');
        return;
    }

    console.log('\n开始上传图片到又拍云...');
    const uploadResults = await uploadImagesToUpyun(weixinImages, service, operator, password);

    console.log('\n上传结果汇总:');
    uploadResults.forEach((result, index) => {
        console.log(`${index + 1}. ${result.originalUrl}`);
        console.log(`   上传后地址: ${result.upyunUrl}`);
        console.log(`   保存路径: ${result.savePath}`);
        console.log(`   来源文件: ${result.sourceFile}`);
        console.log('   ---');
    });

    console.log(`\n成功上传 ${uploadResults.length} 个图片`);

    // 替换 Markdown 文件中的图片 URL
    console.log('\n开始替换 Markdown 文件中的图片 URL...');
    const docsPath = path.join(import.meta.dirname, '../docs');
    const updatedFiles = new Set();

    // 按文件分组上传结果
    const resultsByFile = {};
    uploadResults.forEach(result => {
        if (!resultsByFile[result.sourceFile]) {
            resultsByFile[result.sourceFile] = [];
        }
        resultsByFile[result.sourceFile].push(result);
    });

    // 遍历每个包含微信图片的文件，替换其中的图片 URL
    Object.keys(resultsByFile).forEach(filePath => {
        const fileResults = resultsByFile[filePath];
        const relativePath = path.relative(docsPath, filePath);

        console.log(`\n正在处理文件: ${relativePath}`);

        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf-8');


        // 替换所有图片链接
        fileResults.forEach(result => {
            // 替换 Markdown 格式的图片 ![](url)
            const markdownImageRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegExp(result.originalUrl)}\\)`, 'g');
            content = content.replace(markdownImageRegex, `![$1](${result.upyunUrl})`);

            // 替换 HTML img 标签格式的图片
            const htmlImageRegex = new RegExp(`<img[^>]+src=["']${escapeRegExp(result.originalUrl)}["'][^>]*>`, 'g');
            content = content.replace(htmlImageRegex, (match) => {
                return match.replace(result.originalUrl, result.upyunUrl);
            });
        });
        const { data: frontmatter, content: markdownContent } = matter(content);

        delete frontmatter.origin;
        frontmatter.date = dayjs().format('YYYY-MM-DD HH:mm:ss')

        // 重新组合 frontmatter 和内容
        content = matter.stringify(markdownContent, frontmatter);

        // 写入更新后的内容到文件
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  - 已更新 ${fileResults.length} 个图片链接`);
        console.log(`  - origin 已更新为 'me'`);

        updatedFiles.add(filePath);
    });

    console.log(`\n总共更新了 ${updatedFiles.size} 个文件`);
}

// 转义正则表达式特殊字符
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main()