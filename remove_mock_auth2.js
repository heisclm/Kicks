const fs = require('fs');

function removeMock(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Instead of regex, let's just find the start and end of the block
    let mockStr = 'if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== ';
    if (content.includes(mockStr)) {
        let lines = content.split('\n');
        let newLines = [];
        let skip = false;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('if (process.env.EXPO_PUBLIC_USE_MOCK_DATA')) {
                skip = true;
            }
            
            if (!skip) {
                newLines.push(lines[i]);
            }
            
            // Assume the block ends with "return;" followed by "}"
            if (skip && lines[i].includes('return;') && lines[i+1] && lines[i+1].includes('}')) {
                skip = false;
                i++; // skip the closing brace
            }
        }
        fs.writeFileSync(file, newLines.join('\n'), 'utf8');
    } else {
        // Handle variations of quotes (double vs single)
        let mockStr2 = 'if (process.env.EXPO_PUBLIC_USE_MOCK_DATA';
        if (content.includes(mockStr2)) {
            let lines = content.split('\n');
            let newLines = [];
            let skip = false;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('if (process.env.EXPO_PUBLIC_USE_MOCK_DATA')) {
                    skip = true;
                }
                
                if (!skip) {
                    newLines.push(lines[i]);
                }
                
                if (skip && lines[i].includes('return;') && lines[i+1] && (lines[i+1].includes('}') || lines[i+1].trim() === '}')) {
                    skip = false;
                    i++; // skip the closing brace
                }
            }
            fs.writeFileSync(file, newLines.join('\n'), 'utf8');
        }
    }
}

removeMock('mobile/app/(auth)/login.tsx');
removeMock('mobile/app/(auth)/register.tsx');
