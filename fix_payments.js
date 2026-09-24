const fs = require('fs');
let file = 'mobile/app/profile/payments.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix back button
content = content.replace(/onPress=\{\(\) => router\.push\('\/checkout'\)\} style=\{styles\.backButton\}/g, "onPress={() => router.back()} style={styles.backButton}");

// Fix Plus icon navigation
content = content.replace(/<IconButton\s*\n\s*icon=\{<Plus color=\{colors\.textPrimary\} size=\{24\} strokeWidth=\{2\.5\} \/>\}\s*\n\s*style=\{styles\.backButton\}\s*\n\s*\/>/, `<IconButton 
          icon={<Plus color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          style={styles.backButton}
          onPress={() => router.push('/profile/add-payment')}
        />`);

fs.writeFileSync(file, content, 'utf8');
