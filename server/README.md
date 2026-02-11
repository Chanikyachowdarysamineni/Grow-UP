# Grow Up - Code Execution Backend Server

This is the backend server for the Grow Up code editor that handles secure code execution.

## Features

- ✅ Secure code execution with timeouts and resource limits
- ✅ Support for multiple languages: Python, JavaScript, TypeScript, Java, C, C++, Go
- ✅ Input handling (stdin)
- ✅ Execution time tracking
- ✅ Error handling and reporting
- ✅ Automatic cleanup of temporary files

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v14 or higher)
- **Python** (for Python code execution)
- **Node.js** (for JavaScript/TypeScript execution)
- **Java JDK** (for Java execution)
- **GCC/G++** (for C/C++ execution)
- **Go** (for Go execution)

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Execute Code
```
POST /api/execute
```

**Request Body:**
```json
{
  "language": "python",
  "code": "print('Hello World')",
  "input": "" // optional stdin input
}
```

**Response:**
```json
{
  "output": "Hello World\n",
  "error": "",
  "executionTime": 45
}
```

## Security Features

- ⏱️ **Execution Timeout**: Programs are terminated after 5-10 seconds
- 💾 **Memory Limits**: Output buffer limited to 1MB
- 🔒 **Input Sanitization**: Dangerous characters removed from input
- 🧹 **Auto Cleanup**: Temporary files deleted after execution
- 🗑️ **Periodic Cleanup**: Old files cleaned every hour

## Language Support

| Language   | Extension | Timeout |
|------------|-----------|---------|
| Python     | .py       | 5s      |
| JavaScript | .js       | 5s      |
| TypeScript | .ts       | 5s      |
| Java       | .java     | 10s     |
| C          | .c        | 10s     |
| C++        | .cpp      | 10s     |
| Go         | .go       | 10s     |

## Error Handling

The server handles various error scenarios:

- Compilation errors
- Runtime errors
- Timeout errors
- Missing compiler/interpreter errors

## Notes

⚠️ **Important**: This server is designed for development and educational purposes. For production use, consider:
- Using Docker containers for isolation
- Implementing rate limiting
- Adding authentication
- Using a proper sandboxing solution (e.g., Judge0, Piston)

## Recommended Production Setup

For production, use a sandboxed execution environment like:
- **Judge0** (https://github.com/judge0/judge0)
- **Piston** (https://github.com/engineer-man/piston)
- **Docker containers** with resource limits

These provide better security and isolation.