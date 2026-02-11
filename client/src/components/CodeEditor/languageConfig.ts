/* eslint-disable no-template-curly-in-string */
// ============================================
// COMPREHENSIVE LANGUAGE TEMPLATES  
// ============================================

export const languageTemplates: Record<string, string> = {
  // ========== CORE COMPILED LANGUAGES ==========
  python: `# Python Program
def main():
    print("Hello from Python! 🐍")
    numbers = [1, 2, 3, 4, 5]
    print(f"Sum: {sum(numbers)}")

if __name__ == "__main__":
    main()
`,

  java: `// Java Program
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java! ☕");
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}
`,

  c: `// C Program
#include <stdio.h>

int main() {
    printf("Hello from C! ⚙️\\n");
    int numbers[] = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += numbers[i];
    }
    printf("Sum: %d\\n", sum);
    return 0;
}
`,

  cpp: `// C++ Program
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello from C++! ⚙️" << endl;
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int num : numbers) {
        sum += num;
    }
    cout << "Sum: " << sum << endl;
    return 0;
}
`,

  go: `// Go Program
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go! 🔷")
    numbers := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    fmt.Printf("Sum: %d\\n", sum)
}
`,

  rust: `// Rust Program
fn main() {
    println!("Hello from Rust! 🦀");
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}
`,

  csharp: `// C# Program
using System;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#! 💜");
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = numbers.Sum();
        Console.WriteLine($"Sum: {sum}");
    }
}
`,

  // ========== WEB LANGUAGES ==========
  javascript: `// JavaScript Program
console.log("Hello from JavaScript! 🟨");

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log(\`Sum: \${sum}\`);

// Example: Function
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`,

  typescript: `// TypeScript Program
console.log("Hello from TypeScript! 🔷");

const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce((a, b) => a + b, 0);
console.log(\`Sum: \${sum}\`);

// Example: Type-safe function
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        h1 { color: #007acc; }
    </style>
</head>
<body>
    <h1>Hello from HTML! 🌐</h1>
    <p>Welcome to your web page!</p>
    <button onclick="alert('Hello!')">Click Me</button>
</body>
</html>
`,

  css: `/* CSS Stylesheet */
/* Modern, Responsive Styles */

:root {
    --primary-color: #007acc;
    --secondary-color: #333;
    --bg-color: #f5f5f5;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--bg-color);
    color: var(--secondary-color);
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

button {
    background: var(--primary-color);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    opacity: 0.8;
    transform: translateY(-2px);
}
`,

  json: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample JSON configuration",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "keywords": ["javascript", "nodejs"],
  "author": "Your Name",
  "license": "MIT"
}
`,

  markdown: `# Markdown Document 📝

## Welcome to Markdown!

Markdown is easy to learn and powerful for documentation.

### Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- Lists and code blocks

### Code Example

\`\`\`javascript
console.log("Hello, Markdown!");
\`\`\`

> **Note**: Markdown is widely used!
`,

  // ========== SCRIPTING LANGUAGES ==========
  php: `<?php
// PHP Program
echo "Hello from PHP! 🐘\\n";

$numbers = array(1, 2, 3, 4, 5);
$sum = array_sum($numbers);
echo "Sum: $sum\\n";

function greet($name) {
    return "Hello, $name!";
}

echo greet("World") . "\\n";
?>
`,

  ruby: `# Ruby Program
puts "Hello from Ruby! 💎"

numbers = [1, 2, 3, 4, 5]
sum = numbers.sum
puts "Sum: #{sum}"

def greet(name)
    "Hello, #{name}!"
end

puts greet("World")
`,

  shell: `#!/bin/bash
# Shell Script
echo "Hello from Shell! 🐚"

numbers=(1 2 3 4 5)
sum=0

for num in "\${numbers[@]}"; do
    sum=$((sum + num))
done

echo "Sum: $sum"
`,

  // ========== MOBILE & MODERN LANGUAGES ==========
  kotlin: `// Kotlin Program
fun main() {
    println("Hello from Kotlin! 🎯")
    
    val numbers = listOf(1, 2, 3, 4, 5)
    val sum = numbers.sum()
    println("Sum: $sum")
    
    fun greet(name: String) = "Hello, $name!"
    println(greet("World"))
}
`,

  swift: `// Swift Program
import Foundation

print("Hello from Swift! 🍎")

let numbers = [1, 2, 3, 4, 5]
let sum = numbers.reduce(0, +)
print("Sum: \\(sum)")

func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

print(greet(name: "World"))
`,

  dart: `// Dart Program
void main() {
  print('Hello from Dart! 🎯');
  
  var numbers = [1, 2, 3, 4, 5];
  var sum = numbers.reduce((a, b) => a + b);
  print('Sum: $sum');
  
  String greet(String name) => 'Hello, $name!';
  print(greet('World'));
}
`,

  // ========== DATA & QUERY LANGUAGES ==========
  sql: `-- SQL Script
-- Create table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);

-- Insert data
INSERT INTO users (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');

-- Query data
SELECT * FROM users WHERE name LIKE 'J%';
`,

  r: `# R Program
cat("Hello from R! 📊\\n")

numbers <- c(1, 2, 3, 4, 5)
sum_result <- sum(numbers)
cat("Sum:", sum_result, "\\n")

greet <- function(name) {
    paste("Hello,", name, "!")
}

print(greet("World"))
`,
};


// ============================================
// LANGUAGE CONFIGURATIONS
// ============================================

export const languageConfigs: Record<string, any> = {
  // Core Languages
  python: { extension: '.py', comment: '#', executable: 'python', displayName: 'Python',icon: '🐍', category: 'core' },
  java: { extension: '.java', comment: '//', executable: 'java', displayName: 'Java', icon: '☕', category: 'core' },
  c: { extension: '.c', comment: '//', executable: 'gcc', displayName: 'C', icon: '⚙️', category: 'core' },
  cpp: { extension: '.cpp', comment: '//', executable: 'g++', displayName: 'C++', icon: '⚙️', category: 'core' },
  go: { extension: '.go', comment: '//', executable: 'go', displayName: 'Go', icon: '🔷', category: 'core' },
  rust: { extension: '.rs', comment: '//', executable: 'rustc', displayName: 'Rust', icon: '🦀', category: 'core' },
  csharp: { extension: '.cs', comment: '//', executable: 'csc', displayName: 'C#', icon: '💜', category: 'core' },
  
  // Web Languages
  javascript: { extension: '.js', comment: '//', executable: 'node', displayName: 'JavaScript', icon: '🟨', category: 'web' },
  typescript: { extension: '.ts', comment: '//', executable: 'ts-node', displayName: 'TypeScript', icon: '🔷', category: 'web' },
  html: { extension: '.html', comment: '<!--', displayName: 'HTML', icon: '🌐', category: 'web' },
  css: { extension: '.css', comment: '/*', displayName: 'CSS', icon: '🎨', category: 'web' },
  json: { extension: '.json', comment: '//', displayName: 'JSON', icon: '📦', category: 'web' },
  markdown: { extension: '.md', comment: '<!--', displayName: 'Markdown', icon: '📝', category: 'web' },
  
  // Scripting Languages
  php: { extension: '.php', comment: '//', executable: 'php', displayName: 'PHP', icon: '🐘', category: 'scripting' },
  ruby: { extension: '.rb', comment: '#', executable: 'ruby', displayName: 'Ruby', icon: '💎', category: 'scripting' },
  shell: { extension: '.sh', comment: '#', executable: 'bash', displayName: 'Shell Script', icon: '🐚', category: 'scripting' },
  
  // Mobile & Modern
  kotlin: { extension: '.kt', comment: '//', executable: 'kotlin', displayName: 'Kotlin', icon: '🎯', category: 'mobile' },
  swift: { extension: '.swift', comment: '//', executable: 'swift', displayName: 'Swift', icon: '🍎', category: 'mobile' },
  dart: { extension: '.dart', comment: '//', executable: 'dart', displayName: 'Dart', icon: '🎯', category: 'mobile' },
  
  // Data & Query
  sql: { extension: '.sql', comment: '--', displayName: 'SQL', icon: '🗄️', category: 'data' },
  r: { extension: '.r', comment: '#', executable: 'Rscript', displayName: 'R', icon: '📊', category: 'data' },
};


// ============================================
// INTELLISENSE CODE SNIPPETS
// ============================================

export const codeSnippets: Record<string, Record<string, string>> = {
  python: {
    'print': 'print(${1:"Hello"})',
    'for': 'for ${1:i} in range(${2:10}):\n    ${3:pass}',
    'if': 'if ${1:condition}:\n    ${2:pass}',
    'def': 'def ${1:function_name}(${2:params}):\n    ${3:pass}',
    'class': 'class ${1:ClassName}:\n    def __init__(self, ${2:params}):\n        ${3:pass}',
  },
  java: {
    'sysout': 'System.out.println(${1:"Hello"});',
    'for': 'for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'method': 'public ${1:void} ${2:methodName}(${3:params}) {\n    ${4:// code}\n}',
    'class': 'public class ${1:ClassName} {\n    ${2:// code}\n}',
  },
  c: {
    'printf': 'printf("${1:%d}\\n", ${2:variable});',
    'for': 'for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'function': '${1:void} ${2:functionName}(${3:params}) {\n    ${4:// code}\n}',
  },
  cpp: {
    'cout': 'cout << ${1:"Hello"} << endl;',
    'for': 'for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'class': 'class ${1:ClassName} {\npublic:\n    ${2:// code}\n};',
  },
  go: {
    'fmt': 'fmt.Println(${1:"Hello"})',
    'for': 'for ${1:i} := 0; ${1:i} < ${2:10}; ${1:i}++ {\n    ${3:// code}\n}',
    'if': 'if ${1:condition} {\n    ${2:// code}\n}',
    'func': 'func ${1:functionName}(${2:params}) ${3:returnType} {\n    ${4:// code}\n}',
  },
  javascript: {
    'log': 'console.log(${1:"message"});',
    'for': 'for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'function': 'function ${1:name}(${2:params}) {\n    ${3:// code}\n}',
    'arrow': 'const ${1:name} = (${2:params}) => {\n    ${3:// code}\n};',
  },
  typescript: {
    'log': 'console.log(${1:"message"});',
    'for': 'for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'function': 'function ${1:name}(${2:params}): ${3:returnType} {\n    ${4:// code}\n}',
    'interface': 'interface ${1:InterfaceName} {\n    ${2:// properties}\n}',
  },
  php: {
    'echo': 'echo "${1:message}";',
    'for': 'for ($${1:i} = 0; $${1:i} < ${2:10}; $${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'function': 'function ${1:name}(${2:params}) {\n    ${3:// code}\n}',
  },
  rust: {
    'println': 'println!("${1:message}");',
    'for': 'for ${1:i} in 0..${2:10} {\n    ${3:// code}\n}',
    'if': 'if ${1:condition} {\n    ${2:// code}\n}',
    'fn': 'fn ${1:name}(${2:params}) -> ${3:returnType} {\n    ${4:// code}\n}',
  },
  csharp: {
    'console': 'Console.WriteLine("${1:message}");',
    'for': 'for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'method': 'public ${1:void} ${2:MethodName}(${3:params}) {\n    ${4:// code}\n}',
  },
  ruby: {
    'puts': 'puts "${1:message}"',
    'for': '${1:array}.each do |${2:item}|\n    ${3:# code}\nend',
    'if': 'if ${1:condition}\n    ${2:# code}\nend',
    'def': 'def ${1:method_name}(${2:params})\n    ${3:# code}\nend',
  },
  kotlin: {
    'println': 'println("${1:message}")',
    'for': 'for (${1:i} in 0..${2:10}) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'fun': 'fun ${1:functionName}(${2:params}): ${3:returnType} {\n    ${4:// code}\n}',
  },
  swift: {
    'print': 'print("${1:message}")',
    'for': 'for ${1:i} in 0..<${2:10} {\n    ${3:// code}\n}',
    'if': 'if ${1:condition} {\n    ${2:// code}\n}',
    'func': 'func ${1:functionName}(${2:params}) -> ${3:ReturnType} {\n    ${4:// code}\n}',
  },
  dart: {
    'print': 'print(\'${1:message}\');',
    'for': 'for (var ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3:// code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:// code}\n}',
    'func': '${1:void} ${2:functionName}(${3:params}) {\n    ${4:// code}\n}',
  },
  sql: {
    'select': 'SELECT ${1:*} FROM ${2:table} WHERE ${3:condition};',
    'insert': 'INSERT INTO ${1:table} (${2:columns}) VALUES (${3:values});',
    'update': 'UPDATE ${1:table} SET ${2:column} = ${3:value} WHERE ${4:condition};',
    'delete': 'DELETE FROM ${1:table} WHERE ${2:condition};',
  },
  r: {
    'print': 'print(${1:"message"})',
    'for': 'for (${1:i} in 1:${2:10}) {\n    ${3:# code}\n}',
    'if': 'if (${1:condition}) {\n    ${2:# code}\n}',
    'function': '${1:name} <- function(${2:params}) {\n    ${3:# code}\n}',
  },
  shell: {
    'echo': 'echo "${1:message}"',
    'for': 'for ${1:item} in ${2:list}; do\n    ${3:# code}\ndone',
    'if': 'if [ ${1:condition} ]; then\n    ${2:# code}\nfi',
    'function': '${1:function_name}() {\n    ${2:# code}\n}',
  },
  html: {},
  css: {},
  json: {},
  markdown: {},
};

const config = {
  languageTemplates,
  languageConfigs,
  codeSnippets,
};

export default config;