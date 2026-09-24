const fs = require('fs');
let file = 'mobile/app/(tabs)/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the static banner section
const replacement = `
          {/* Featured Banner */}
          {products.length > 0 && (
          <View style={styles.featuredContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredBanner}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredLabel}>Featured</Text>
                <Text style={styles.featuredTitle} numberOfLines={2}>{products[0].name.replace('Nike ', '')}</Text>
                <Pressable style={styles.shopNowButton} onPress={() => router.push(\`/details/\${products[0].id}\`)}>
                  <Text style={styles.shopNowText}>Shop now</Text>
                </Pressable>
              </View>
              <Image 
                source={products[0].image as any} 
                style={styles.featuredImage} 
                resizeMode="contain"
              />
            </LinearGradient>
          </View>
          )}
`;

content = content.replace(/\{\/\* Featured Banner \*\/\}[\s\S]*?<\/View>\s*\{\/\* Brands \*\/\}/, replacement + '\n          {/* Brands */}');

fs.writeFileSync(file, content, 'utf8');
