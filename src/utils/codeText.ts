export default function (content: string, tag: string = '') {
    return `\`\`\`${tag}\n${content}\`\`\``;
}