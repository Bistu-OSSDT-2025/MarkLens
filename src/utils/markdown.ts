import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import katex from 'katex'

// 配置 Markdown 解析器
const md = new MarkdownIt({
  html: true,  
  linkify: true,
  typographer: true
})

// 自动编号插件
const autoNumberPlugin = (md: MarkdownIt) => {
  md.core.ruler.push('auto_number_headings', (state) => {
    // 检查是否启用自动编号
    if (!state.env?.autoNumberHeadings) {
      return
    }
    
    const tokens = state.tokens
    const counters = [0, 0, 0, 0, 0, 0] // 支持6级标题的计数器
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      
      if (token.type === 'heading_open') {
        const level = parseInt(token.tag.substring(1)) - 1 // 转换为0-5的索引
        
        // 重置更深层级的计数器
        for (let j = level + 1; j < counters.length; j++) {
          counters[j] = 0
        }
        
        // 增加当前层级的计数器
        counters[level]++
        
        // 生成编号字符串
        let numberStr = ''
        for (let j = 0; j <= level; j++) {
          if (counters[j] > 0) {
            if (numberStr) numberStr += '.'
            numberStr += counters[j]
          }
        }
        
        // 添加编号到标题内容
        const nextToken = tokens[i + 1]
        if (nextToken && nextToken.type === 'inline') {
          nextToken.content = `${numberStr} ${nextToken.content}`
          
          // 如果有children，也需要更新第一个文本token
          if (nextToken.children && nextToken.children.length > 0) {
            const firstChild = nextToken.children[0]
            if (firstChild && firstChild.type === 'text') {
              firstChild.content = `${numberStr} ${firstChild.content}`
            }
          }
        }
      }
    }
  })
}

// 启用自动编号插件
md.use(autoNumberPlugin)

// 设置语法高亮
md.set({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 数学公式插件
const mathPlugin = (md: MarkdownIt) => {
  // 行内数学公式
  md.inline.ruler.after('escape', 'math_inline', ((state: any, start: any, maximum: any, silent: any) => {
    if (state.src[start] !== '$') return false
    if (state.src[start + 1] === '$') return false

    let pos = start + 1
    while (pos < maximum && state.src[pos] !== '$') {
      if (state.src[pos] === '\\') pos += 2
      else pos += 1
    }

    if (pos >= maximum || state.src[pos] !== '$') return false

    const content = state.src.slice(start + 1, pos)
    if (content.trim() === '') return false

    if (!silent) {
      const token = state.push('math_inline', 'span', 0)
      token.content = content
      token.markup = '$'
    }

    state.pos = pos + 1
    return true
  }) as any)

  // 块级数学公式
  md.block.ruler.after('blockquote', 'math_block', ((state: any, start: any, end: any, silent: any) => {
    const marker = '$$'
    let pos = state.bMarks[start] + state.tShift[start]
    let max = state.eMarks[start]

    if (pos + marker.length > max) return false
    if (state.src.slice(pos, pos + marker.length) !== marker) return false

    pos += marker.length
    let firstLine = state.src.slice(pos, max).trim()

    if (firstLine.endsWith(marker)) {
      firstLine = firstLine.slice(0, -marker.length).trim()
    }

    let nextLine = start
    let haveEndMarker = firstLine.endsWith(marker)

    if (!haveEndMarker) {
      for (nextLine = start + 1; nextLine < end; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine]
        max = state.eMarks[nextLine]

        if (pos < max && state.tShift[nextLine] < state.blkIndent) break

        const line = state.src.slice(pos, max).trim()
        if (line.endsWith(marker)) {
          haveEndMarker = true
          break
        }
      }
    }

    if (!haveEndMarker) return false

    const content = haveEndMarker && firstLine.endsWith(marker) 
      ? firstLine.slice(0, -marker.length).trim()
      : state.getLines(start + 1, nextLine, 0, false).trim()

    if (!silent) {
      const token = state.push('math_block', 'div', 0)
      token.block = true
      token.content = content
      token.markup = marker
    }

    state.line = nextLine + (haveEndMarker ? 1 : 0)
    return true
  }) as any)

  // 渲染行内数学
  md.renderer.rules.math_inline = (tokens, idx) => {
    const token = tokens[idx]
    try {
      return katex.renderToString(token.content, { throwOnError: false })
    } catch (err) {
      return `<span class="katex-error">${md.utils.escapeHtml(token.content)}</span>`
    }
  }

  // 渲染块级数学
  md.renderer.rules.math_block = (tokens, idx) => {
    const token = tokens[idx]
    try {
      return `<div class="katex-display">${katex.renderToString(token.content, { 
        throwOnError: false,
        displayMode: true 
      })}</div>\n`
    } catch (err) {
      return `<div class="katex-error katex-display">${md.utils.escapeHtml(token.content)}</div>\n`
    }
  }
}

// 启用数学公式插件
md.use(mathPlugin)

// 任务列表插件
const taskListPlugin = (md: MarkdownIt) => {
  md.core.ruler.after('inline', 'github-task-lists', (state) => {
    const tokens = state.tokens
    for (let i = 2; i < tokens.length; i++) {
      if (tokens[i].type === 'inline' && 
          tokens[i - 1].type === 'paragraph_open' &&
          tokens[i - 2].type === 'list_item_open') {
        
        const content = tokens[i].content
        const match = content.match(/^\[( |x)\] (.*)/)
        
        if (match) {
          const checked = match[1] === 'x'
          const text = match[2]
          
          tokens[i].content = text
          tokens[i].children = tokens[i].children || []
          
          // 添加复选框
          const checkbox = new state.Token('html_inline', '', 0)
          checkbox.content = `<input type="checkbox" ${checked ? 'checked' : ''} disabled> `
          tokens[i].children!.unshift(checkbox)
        }
      }
    }
  })
}

md.use(taskListPlugin)

// 表格样式增强
md.renderer.rules.table_open = () => '<div class="table-container"><table class="markdown-table">\n'
md.renderer.rules.table_close = () => '</table></div>\n'

// 代码块样式增强
md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const token = tokens[idx]
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
  let langName = ''
  
  if (info) {
    langName = info.split(/\s+/g)[0]
  }

  const attrs = slf.renderAttrs(token)
  
  if (options.highlight) {
    const highlighted = options.highlight(token.content, langName, attrs) || md.utils.escapeHtml(token.content)
    return `<div class="code-block">
      ${langName ? `<div class="code-block-header">
        <span class="code-block-lang">${md.utils.escapeHtml(langName)}</span>
      </div>` : ''}
      ${highlighted}
    </div>\n`
  }

  return `<pre${attrs}><code>${md.utils.escapeHtml(token.content)}</code></pre>\n`
}

/**
 * 渲染 Markdown 为 HTML
 */
export function renderMarkdown(content: string, options?: { autoNumberHeadings?: boolean }): string {
  const env = {
    autoNumberHeadings: options?.autoNumberHeadings ?? true
  }
  return md.render(content, env)
}

/**
 * 获取 Markdown 内容的目录结构
 */
export function extractTOC(content: string, options?: { autoNumberHeadings?: boolean }): Array<{
  level: number
  title: string
  anchor: string
}> {
  const tokens = md.parse(content, {})
  const toc = []
  const counters = [0, 0, 0, 0, 0, 0] // 支持6级标题的计数器
  const enableNumbering = options?.autoNumberHeadings ?? true
  
  for (const token of tokens) {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1))
      const titleToken = tokens[tokens.indexOf(token) + 1]
      
      if (titleToken && titleToken.type === 'inline') {
        let title = titleToken.content
        
        if (enableNumbering) {
          // 计算编号
          const levelIndex = level - 1
          
          // 重置更深层级的计数器
          for (let j = levelIndex + 1; j < counters.length; j++) {
            counters[j] = 0
          }
          
          // 增加当前层级的计数器
          counters[levelIndex]++
          
          // 生成编号字符串
          let numberStr = ''
          for (let j = 0; j <= levelIndex; j++) {
            if (counters[j] > 0) {
              if (numberStr) numberStr += '.'
              numberStr += counters[j]
            }
          }
          
          title = `${numberStr} ${titleToken.content}`
        }
        
        const anchor = title.toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
          .replace(/\s+/g, '-')
        
        toc.push({ level, title, anchor })
      }
    }
  }
  
  return toc
}

/**
 * 计算文档统计信息
 */
export function getDocumentStats(content: string): {
  wordCount: number
  charCount: number
  readingTime: number
} {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/^#{1,6}\s+/gm, '') // 标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
    .replace(/\*(.*?)\*/g, '$1') // 斜体
    .replace(/`(.*?)`/g, '$1') // 行内代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/^\s*[-*+]\s+/gm, '') // 列表
    .replace(/^\s*\d+\.\s+/gm, '') // 有序列表
    .replace(/^>\s+/gm, '') // 引用
    .trim()

  const charCount = content.length
  const words = plainText.split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // 估算阅读时间（每分钟250字）
  const readingTime = Math.ceil(wordCount / 250)
  
  return {
    wordCount,
    charCount,
    readingTime
  }
}

/**
 * 插入 Markdown 语法
 */
export function insertMarkdownSyntax(
  content: string,
  selection: { start: number; end: number },
  syntax: {
    prefix: string
    suffix?: string
    placeholder?: string
  }
): {
  newContent: string
  newSelection: { start: number; end: number }
} {
  const { start, end } = selection
  const { prefix, suffix = '', placeholder = '' } = syntax
  
  const selectedText = content.substring(start, end)
  const insertText = selectedText || placeholder
  const newText = prefix + insertText + suffix
  
  const newContent = content.substring(0, start) + newText + content.substring(end)
  const newSelection = {
    start: start + prefix.length,
    end: start + prefix.length + insertText.length
  }
  
  return { newContent, newSelection }
}

/**
 * 自动补全 Markdown 语法
 */
export function autoCompleteMarkdown(content: string, cursorPos: number): {
  shouldComplete: boolean
  completion?: string
  newCursorPos?: number
} {
  const beforeCursor = content.substring(0, cursorPos)
  const afterCursor = content.substring(cursorPos)
  
  // 自动补全列表
  if (beforeCursor.endsWith('\n- ') || beforeCursor.endsWith('\n* ') || beforeCursor.endsWith('\n+ ')) {
    if (afterCursor.startsWith('\n') || afterCursor === '') {
      return {
        shouldComplete: true,
        completion: '',
        newCursorPos: cursorPos
      }
    }
  }
  
  // 自动补全有序列表
  const orderedListMatch = beforeCursor.match(/\n(\d+)\. $/)
  if (orderedListMatch) {
    const nextNumber = parseInt(orderedListMatch[1]) + 1
    return {
      shouldComplete: true,
      completion: `${nextNumber}. `,
      newCursorPos: cursorPos + `${nextNumber}. `.length
    }
  }
  
  // 自动补全引用
  if (beforeCursor.endsWith('\n> ')) {
    return {
      shouldComplete: true,
      completion: '> ',
      newCursorPos: cursorPos + 2
    }
  }
  
  return { shouldComplete: false }
} 