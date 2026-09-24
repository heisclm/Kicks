const fs = require('fs');
let file = 'mobile/app/(auth)/register.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /if \(error\) \{\s*useToastStore\.getState\(\)\.showToast\('Registration Failed', error\.message, 'error'\);\s*\} else \{\s*useToastStore\.getState\(\)\.showToast\('Success', 'Account created! Please log in\.', 'success'\);\s*router\.back\(\);\s*\}/m;

const newSuccess = `if (error) {
      useToastStore.getState().showToast('Registration Failed', error.message, 'error');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Verify Your Email ??",
        \`We've sent a verification link to \${email}.\\n\\nPlease check your inbox (and spam folder) to verify your account before logging in.\`,
        [
          {
            text: "I'll check it",
            style: "default",
            onPress: () => router.back(),
          }
        ]
      );
    }`;

content = content.replace(regex, newSuccess);
fs.writeFileSync(file, content, 'utf8');
