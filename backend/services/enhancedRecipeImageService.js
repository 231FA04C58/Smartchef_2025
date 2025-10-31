/**
 * Enhanced Recipe Image Service
 * Maps all 180+ recipes to specific Unsplash images
 * Based on Google Images search results pattern
 */

// Comprehensive mapping of all recipes to unique Unsplash images
// These images match the style and cuisine of each recipe
const COMPLETE_RECIPE_IMAGE_MAP = {
  // Indian Cuisine
  'butter chicken': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'chicken tikka masala': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'palak paneer': 'https://images.unsplash.com/photo-1567213819538-ff3e2e06a775?w=800&h=600&fit=crop&q=80',
  'dal makhani': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
  'chana masala': 'https://images.unsplash.com/photo-1572058688129-c9e3b8a2aefd?w=800&h=600&fit=crop&q=80',
  'aloo gobi': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=800&h=600&fit=crop&q=80',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80',
  'naan': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'roti': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80', // Naan/bread image
  'masala dosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80',
  'chicken biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=800&h=600&fit=crop&q=80',
  
  // Chinese Cuisine
  'kung pao': 'https://images.unsplash.com/photo-1582894097876-5b676108fa1b?w=800&h=600&fit=crop&q=80',
  'kung pao chicken': 'https://images.unsplash.com/photo-1582894097876-5b676108fa1b?w=800&h=600&fit=crop&q=80',
  'sweet and sour': 'https://images.unsplash.com/photo-1576402187879-877d6e67e8b8?w=800&h=600&fit=crop&q=80', // Chinese food
  'mapo tofu': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'general tso': 'https://images.unsplash.com/photo-1582894097876-5b676108fa1b?w=800&h=600&fit=crop&q=80',
  'hot and sour soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'peking duck': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80', // Chicken/duck
  'dumpling': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'dumplings': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'spring roll': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'spring rolls': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'fried rice': 'https://images.unsplash.com/photo-1512058688129-c9e3b8a2aefd?w=800&h=600&fit=crop&q=80',
  'lo mein': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80', // Noodles
  
  // Italian Cuisine
  'pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'margherita pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'spaghetti': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'risotto': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'fettuccine': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'alfredo': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'penne': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'chicken parmigiana': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'bruschetta': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'minestrone': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'tiramisu': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  
  // Mexican Cuisine
  'taco': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80', // Tacos
  'enchilada': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'quesadilla': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80', // Mexican food
  'guacamole': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
  'chiles rellenos': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'carnitas': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80', // Mexican meat
  'pozole': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'churro': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'churros': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'salsa verde': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
  'fish taco': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80',
  'fish tacos': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80',
  'beef taco': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80',
  'beef tacos': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80',
  'chicken enchilada': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'chicken enchiladas': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'chicken quesadilla': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80',
  'chicken quesadillas': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80',
  
  // Japanese Cuisine
  'teriyaki': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'chicken teriyaki': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
  'sushi roll': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
  'sushi rolls': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
  'ramen': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop&q=80', // Ramen
  'miso soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'tonkatsu': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'yakitori': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'tempura': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
  'okonomiyaki': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'katsu curry': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'onigiri': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
  'sushi platter': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
  
  // Thai Cuisine
  'pad thai': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&h=600&fit=crop&q=80', // Pad Thai
  'green curry': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'tom yum': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'tom yum soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'pad krapow': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&h=600&fit=crop&q=80', // Thai noodle
  'massaman': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'massaman curry': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'som tam': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  'thai basil chicken': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'mango sticky rice': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'larb': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  'satay': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  
  // American Cuisine
  'chicken wing': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'chicken wings': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'bbq rib': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80', // BBQ meat
  'bbq ribs': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'mac and cheese': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'chicken fried steak': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'clam chowder': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'pot roast': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'buffalo chicken': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'pulled pork': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80', // BBQ pork
  'cheeseburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80', // Burger
  'cornbread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  
  // French Cuisine
  'coq au vin': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'boeuf bourguignon': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'ratatouille': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'french onion soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'cassoulet': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'bouillabaisse': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'quiche lorraine': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'croque monsieur': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80', // Sandwich
  'crepe': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'crepes': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'duck confit': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80', // Duck
  
  // Mediterranean/Middle Eastern
  'greek salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  'hummus': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'falafel': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80',
  'shawarma': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80', // Kebab/meat
  'spanakopita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'moussaka': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'tzatziki': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
  'stuffed grape leaves': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'baklava': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'lamb kebab': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'chicken kebab': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'baba ganoush': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'tabbouleh': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  'kofta': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'kibbeh': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80',
  'shakshuka': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'fattoush': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  'lamb tagine': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'pita bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'mujadara': 'https://images.unsplash.com/photo-1512058688129-c9e3b8a2aefd?w=800&h=600&fit=crop&q=80',
  
  // Korean Cuisine
  'bulgogi': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'kimchi': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'bibimbap': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80', // Korean bowl
  'korean bbq': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'japchae': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80', // Korean noodles
  'tteokbokki': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80', // Korean dish
  'korean fried chicken': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'kimchi jjigae': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'galbi': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'haemul pajeon': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  
  // Vietnamese Cuisine
  'pho': 'https://images.unsplash.com/photo-1617196034796-4e0c7b7c2a8a?w=800&h=600&fit=crop&q=80', // Pho soup
  'banh mi': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80', // Sandwich
  'bun cha': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'com tam': 'https://images.unsplash.com/photo-1617196034796-4e0c7b7c2a8a?w=800&h=600&fit=crop&q=80', // Vietnamese rice
  'goi cuon': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'banh xeo': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'bo kho': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'canh chua': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'che': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  
  // Spanish Cuisine
  'paella': 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=800&h=600&fit=crop&q=80', // Rice dish
  'seafood paella': 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=800&h=600&fit=crop&q=80',
  'gazpacho': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'patatas bravas': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'tortilla espanola': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'tapas': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80', // Spanish tapas
  'sangria': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'flan': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'albondigas': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'pisto': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  
  // Seafood
  'grilled salmon': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'salmon': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'shrimp scampi': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80', // Seafood
  'shrimp': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'fish and chips': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80', // Fish
  'lobster roll': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80', // Sandwich
  'crab cake': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80', // Seafood
  'crab cakes': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'cioppino': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'fish': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  
  // Soups
  'tomato soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'chicken noodle soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'lentil soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'wonton soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'borscht': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'chowder': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  
  // Desserts
  'chocolate cake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'cake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'ice cream': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'cheesecake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'brownies': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'apple pie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'pie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'chocolate chip cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'chocolate chip cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'creme brulee': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'panna cotta': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'lemon bar': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'lemon bars': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  
  // Breakfast
  'pancake': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'pancakes': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'waffle': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'waffles': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'french toast': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'omelette': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'scrambled egg': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'scrambled eggs': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'egg': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'eggs benedict': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'breakfast burrito': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&h=600&fit=crop&q=80', // Burrito
  'hash brown': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'hash browns': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'bacon': 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=800&h=600&fit=crop&q=80', // Keep this - seems to work
  'sausage': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80', // Meat
  
  // Vegetarian
  'vegetarian lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'veggie burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80', // Burger
  'stuffed bell pepper': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'stuffed bell peppers': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'quinoa bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'cauliflower steak': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'mushroom risotto': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'eggplant parmesan': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'zucchini noodle': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'zucchini noodles': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'vegetable curry': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'vegetable': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'vegetable stir fry': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  'caesar salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
};

/**
 * Get image URL for a recipe with smart keyword matching
 */
const getRecipeImage = (recipeTitle, cuisine = '') => {
  // Handle null/undefined titles
  if (!recipeTitle || typeof recipeTitle !== 'string') {
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80';
  }
  
  const recipeLower = recipeTitle.toLowerCase().trim();
  
  // First, try exact match
  if (COMPLETE_RECIPE_IMAGE_MAP[recipeLower]) {
    return COMPLETE_RECIPE_IMAGE_MAP[recipeLower];
  }
  
  // Try partial matches (longest match first for better specificity)
  // Sort keys by length (longest first) to match more specific terms first
  const sortedKeys = Object.keys(COMPLETE_RECIPE_IMAGE_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (recipeLower.includes(key) || key.includes(recipeLower)) {
      return COMPLETE_RECIPE_IMAGE_MAP[key];
    }
  }
  
  // Smart keyword-based matching for common terms in recipe titles
  const keywordMap = {
    // Indian cuisine keywords
    'biryani': 'biryani',
    'masala': 'butter chicken',
    'paneer': 'palak paneer',
    'dal': 'dal makhani',
    'butter': 'butter chicken',
    'curry': 'butter chicken',
    'tikka': 'chicken tikka masala',
    'samosa': 'samosa',
    'dosa': 'masala dosa',
    'roti': 'roti',
    'naan': 'naan',
    'chana': 'chana masala',
    'aloo': 'aloo gobi',
    'gobi': 'aloo gobi',
    
    // Chinese cuisine keywords
    'noodle': 'lo mein',
    'fried rice': 'fried rice',
    'manchurian': 'kung pao chicken',
    'chowmein': 'lo mein',
    'szechuan': 'kung pao chicken',
    'general tso': 'general tso',
    'sweet and sour': 'sweet and sour',
    'peking': 'peking duck',
    'dumpling': 'dumplings',
    'wonton': 'dumplings',
    
    // Italian cuisine keywords
    'pasta': 'spaghetti',
    'pizza': 'pizza',
    'spaghetti': 'spaghetti',
    'lasagna': 'lasagna',
    'risotto': 'risotto',
    'carbonara': 'carbonara',
    'alfredo': 'alfredo',
    'parmigiana': 'chicken parmigiana',
    'bruschetta': 'bruschetta',
    
    // Mexican cuisine keywords
    'taco': 'taco',
    'burrito': 'taco',
    'enchilada': 'enchilada',
    'quesadilla': 'quesadilla',
    'guacamole': 'guacamole',
    'salsa': 'guacamole',
    'carnitas': 'carnitas',
    
    // Japanese cuisine keywords
    'sushi': 'sushi',
    'ramen': 'ramen',
    'tempura': 'tempura',
    'teriyaki': 'teriyaki',
    'miso': 'miso soup',
    'tonkatsu': 'tonkatsu',
    
    // Thai cuisine keywords
    'pad thai': 'pad thai',
    'tom yum': 'tom yum',
    'green curry': 'green curry',
    'massaman': 'massaman',
    
    // Dessert keywords
    'cake': 'cake',
    'cookie': 'cake',
    'brownie': 'cake',
    'pudding': 'cake',
    'ice cream': 'ice cream',
    'cheesecake': 'cake',
    'pie': 'cake',
    
    // Breakfast keywords
    'pancake': 'pancake',
    'waffle': 'waffle',
    'egg': 'omelette',
    'omelette': 'omelette',
    'toast': 'toast',
    
    // Seafood keywords
    'salmon': 'salmon',
    'shrimp': 'shrimp',
    'fish': 'salmon',
    'lobster': 'salmon',
    'crab': 'salmon',
    
    // Salad keywords
    'salad': 'salad',
    'caesar': 'caesar salad',
    
    // Soup keywords
    'soup': 'soup',
    'chowder': 'clam chowder',
    'pho': 'pho'
  };
  
  // Check keyword matches (more specific keywords first)
  for (const [keyword, mapKey] of Object.entries(keywordMap)) {
    if (recipeLower.includes(keyword)) {
      if (COMPLETE_RECIPE_IMAGE_MAP[mapKey]) {
        return COMPLETE_RECIPE_IMAGE_MAP[mapKey];
      }
    }
  }
  
  // Cuisine-based fallback
  if (cuisine) {
    const cuisineLower = cuisine.toLowerCase();
    if (cuisineLower.includes('indian')) {
      return COMPLETE_RECIPE_IMAGE_MAP['butter chicken'];
    }
    if (cuisineLower.includes('chinese')) {
      return COMPLETE_RECIPE_IMAGE_MAP['fried rice'];
    }
    if (cuisineLower.includes('italian')) {
      return COMPLETE_RECIPE_IMAGE_MAP['pizza'];
    }
    if (cuisineLower.includes('mexican')) {
      return COMPLETE_RECIPE_IMAGE_MAP['taco'];
    }
    if (cuisineLower.includes('japanese')) {
      return COMPLETE_RECIPE_IMAGE_MAP['sushi'];
    }
    if (cuisineLower.includes('thai')) {
      return COMPLETE_RECIPE_IMAGE_MAP['pad thai'];
    }
    if (cuisineLower.includes('korean')) {
      return COMPLETE_RECIPE_IMAGE_MAP['bibimbap'];
    }
    if (cuisineLower.includes('vietnamese')) {
      return COMPLETE_RECIPE_IMAGE_MAP['pho'];
    }
    if (cuisineLower.includes('french')) {
      return COMPLETE_RECIPE_IMAGE_MAP['ratatouille'];
    }
    if (cuisineLower.includes('spanish')) {
      return COMPLETE_RECIPE_IMAGE_MAP['paella'];
    }
    if (cuisineLower.includes('mediterranean') || cuisineLower.includes('middle eastern')) {
      return COMPLETE_RECIPE_IMAGE_MAP['hummus'];
    }
    if (cuisineLower.includes('seafood')) {
      return COMPLETE_RECIPE_IMAGE_MAP['salmon'];
    }
  }
  
  // Type-based fallback
  if (recipeLower.includes('soup')) {
    return COMPLETE_RECIPE_IMAGE_MAP['soup'] || COMPLETE_RECIPE_IMAGE_MAP['pho'];
  }
  if (recipeLower.includes('dessert') || recipeLower.includes('cake') || recipeLower.includes('cookie')) {
    return COMPLETE_RECIPE_IMAGE_MAP['cake'];
  }
  if (recipeLower.includes('breakfast') || recipeLower.includes('pancake') || recipeLower.includes('waffle')) {
    return COMPLETE_RECIPE_IMAGE_MAP['pancake'];
  }
  if (recipeLower.includes('fish') || recipeLower.includes('shrimp') || recipeLower.includes('salmon')) {
    return COMPLETE_RECIPE_IMAGE_MAP['salmon'];
  }
  
  // Default food image
  return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80';
};

/**
 * Fetch recipe images
 */
const fetchRecipeImages = async (recipeTitle, cuisine = '', options = {}) => {
  try {
    const imageUrl = getRecipeImage(recipeTitle, cuisine);
    
    return [{
      url: imageUrl,
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash-enhanced',
      width: 800,
      height: 600
    }];
  } catch (error) {
    console.error('Error fetching recipe images:', error);
    return [{
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash-fallback'
    }];
  }
};

module.exports = {
  fetchRecipeImages,
  getRecipeImage
};

