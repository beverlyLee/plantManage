import { Plant, Reminder, GrowthRecord, PlantCareTip, PlantLocation } from '@/types'
import dayjs from 'dayjs'

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const mockPlantImages: string[] = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=green%20monstera%20deliciosa%20plant%20in%20white%20ceramic%20pot%20indoor%20modern%20minimal&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=peace%20lily%20spathiphyllum%20plant%20with%20white%20flowers%20in%20terracotta%20pot&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=snake%20plant%20sansevieria%20in%20gray%20cement%20pot%20modern%20home%20decor&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pothos%20devils%20ivy%20hanging%20plant%20in%20basket%20lush%20green%20leaves&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=succulent%20collection%20various%20types%20in%20small%20pots%20desert%20plants&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fiddle%20leaf%20fig%20tree%20large%20indoor%20plant%20in%20white%20pot%20living%20room&image_size=square',
]

export const mockPlants: Plant[] = [
  {
    id: generateId(),
    name: '龟背竹',
    nickname: '小龟',
    species: 'Monstera deliciosa',
    image: mockPlantImages[0],
    location: '客厅靠窗',
    description: '热带观叶植物，叶片有独特的孔洞',
    purchaseDate: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
    lastWateredDate: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    lastFertilizedDate: dayjs().subtract(2, 'weeks').format('YYYY-MM-DD'),
    wateringFrequency: 3,
    fertilizingFrequency: 14,
    lightRequirements: 'medium',
    humidityRequirements: 'high',
    temperatureRequirements: {
      min: 18,
      max: 28
    },
    notes: '喜欢明亮的散射光，避免阳光直射',
    createdAt: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    name: '白掌',
    nickname: '一帆风顺',
    species: 'Spathiphyllum',
    image: mockPlantImages[1],
    location: '书房',
    description: '耐阴植物，开白色佛焰苞花',
    purchaseDate: dayjs().subtract(4, 'months').format('YYYY-MM-DD'),
    lastWateredDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    wateringFrequency: 4,
    fertilizingFrequency: 21,
    lightRequirements: 'low',
    humidityRequirements: 'medium',
    notes: '叶片下垂时需要浇水',
    createdAt: dayjs().subtract(4, 'months').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    name: '虎皮兰',
    species: 'Sansevieria trifasciata',
    image: mockPlantImages[2],
    location: '卧室',
    description: '夜间释放氧气，净化空气',
    purchaseDate: dayjs().subtract(8, 'months').format('YYYY-MM-DD'),
    lastWateredDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    wateringFrequency: 14,
    lightRequirements: 'medium',
    humidityRequirements: 'low',
    notes: '非常耐旱，少浇水',
    createdAt: dayjs().subtract(8, 'months').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    name: '绿萝',
    nickname: '小绿',
    species: 'Epipremnum aureum',
    image: mockPlantImages[3],
    location: '厨房',
    description: '极易养护的攀援植物',
    purchaseDate: dayjs().subtract(3, 'months').format('YYYY-MM-DD'),
    lastWateredDate: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    wateringFrequency: 3,
    lightRequirements: 'low',
    humidityRequirements: 'medium',
    notes: '可以水培或土培',
    createdAt: dayjs().subtract(3, 'months').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  }
]

export const mockReminders: Reminder[] = [
  {
    id: generateId(),
    plantId: mockPlants[0].id,
    type: 'watering',
    title: '给龟背竹浇水',
    description: '土壤表面干燥2-3厘米后再浇水',
    scheduledDate: dayjs().add(2, 'days').format('YYYY-MM-DD'),
    scheduledTime: '08:00',
    isRecurring: true,
    recurrencePattern: 'every 3 days',
    isCompleted: false,
    priority: 'medium',
    createdAt: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[1].id,
    type: 'watering',
    title: '给白掌浇水',
    description: '叶片稍微下垂时是最佳浇水时机',
    scheduledDate: dayjs().format('YYYY-MM-DD'),
    scheduledTime: '09:00',
    isRecurring: true,
    recurrencePattern: 'every 4 days',
    isCompleted: false,
    priority: 'high',
    createdAt: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[2].id,
    type: 'fertilizing',
    title: '给虎皮兰施肥',
    description: '使用稀释的液体肥料',
    scheduledDate: dayjs().add(4, 'days').format('YYYY-MM-DD'),
    scheduledTime: '10:00',
    isRecurring: false,
    isCompleted: false,
    priority: 'low',
    createdAt: dayjs().subtract(2, 'weeks').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[3].id,
    type: 'pruning',
    title: '修剪绿萝过长的枝条',
    description: '促进分枝，使株型更丰满',
    scheduledDate: dayjs().add(1, 'week').format('YYYY-MM-DD'),
    isRecurring: false,
    isCompleted: false,
    priority: 'low',
    createdAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
    updatedAt: dayjs().format('YYYY-MM-DD')
  }
]

export const mockGrowthRecords: GrowthRecord[] = [
  {
    id: generateId(),
    plantId: mockPlants[0].id,
    date: dayjs().subtract(1, 'months').format('YYYY-MM-DD'),
    height: 45,
    leafCount: 8,
    health: 'excellent',
    notes: '长出了一片新叶子，非常健康',
    createdAt: dayjs().subtract(1, 'months').format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[0].id,
    date: dayjs().subtract(2, 'weeks').format('YYYY-MM-DD'),
    height: 52,
    leafCount: 9,
    health: 'excellent',
    notes: '新叶展开，又有一片新叶在孕育中',
    createdAt: dayjs().subtract(2, 'weeks').format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[0].id,
    date: dayjs().format('YYYY-MM-DD'),
    height: 58,
    leafCount: 10,
    health: 'good',
    notes: '生长速度很快，需要考虑换盆了',
    createdAt: dayjs().format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[1].id,
    date: dayjs().subtract(3, 'weeks').format('YYYY-MM-DD'),
    height: 30,
    leafCount: 6,
    health: 'good',
    notes: '叶片有些发黄，可能需要施肥',
    createdAt: dayjs().subtract(3, 'weeks').format('YYYY-MM-DD')
  },
  {
    id: generateId(),
    plantId: mockPlants[1].id,
    date: dayjs().subtract(1, 'weeks').format('YYYY-MM-DD'),
    height: 32,
    leafCount: 7,
    health: 'good',
    notes: '施肥后恢复良好，开始开花',
    createdAt: dayjs().subtract(1, 'weeks').format('YYYY-MM-DD')
  }
]

export const mockCareTips: PlantCareTip[] = [
  {
    id: generateId(),
    title: '浇水的正确方法',
    content: '大多数室内植物喜欢在土壤表面干燥2-3厘米后再浇水。浇水要浇透，直到水从排水孔流出。避免频繁少量浇水，这样会导致根系无法吸收足够的水分。',
    category: 'watering',
    seasonal: 'spring'
  },
  {
    id: generateId(),
    title: '光照需求指南',
    content: '不同的植物对光照需求不同。高光照植物需要每天4-6小时的直射阳光；中光照植物需要明亮的散射光；低光照植物可以在距离窗户较远的地方生长。观察植物的叶片颜色变化来判断光照是否合适。',
    category: 'lighting',
    seasonal: 'summer'
  },
  {
    id: generateId(),
    title: '施肥技巧',
    content: '大多数室内植物在生长季节（春夏）每月施肥1-2次，秋季减少，冬季停止施肥。使用稀释的液体肥料效果最好。记住：宁少勿多，过量施肥会烧伤根系。',
    category: 'fertilizing',
    seasonal: 'spring'
  },
  {
    id: generateId(),
    title: '换盆的最佳时机',
    content: '当你看到根系从排水孔长出，或者植物生长速度明显减慢时，就是换盆的好时机。选择比原来大2-4厘米的花盆，使用新鲜的盆栽土。换盆后要浇透水，避免阳光直射几天。',
    category: 'general',
    seasonal: 'spring'
  },
  {
    id: generateId(),
    title: '冬季养护要点',
    content: '冬季大多数植物进入休眠期，需减少浇水频率，停止施肥。注意远离暖气片和冷风直吹的地方。如果室内空气干燥，可以使用加湿器或者将植物放在装满水和石子的托盘上增加湿度。',
    category: 'general',
    seasonal: 'winter'
  }
]

export const mockLocations: PlantLocation[] = [
  {
    id: generateId(),
    name: '客厅靠窗',
    description: '南向窗户，光线充足',
    lightLevels: 'high',
    humidityLevels: 'medium'
  },
  {
    id: generateId(),
    name: '书房',
    description: '东向窗户，早晨有阳光',
    lightLevels: 'medium',
    humidityLevels: 'medium'
  },
  {
    id: generateId(),
    name: '卧室',
    description: '北向，光线较弱',
    lightLevels: 'low',
    humidityLevels: 'low'
  },
  {
    id: generateId(),
    name: '厨房',
    description: '湿度较高，有窗户',
    lightLevels: 'medium',
    humidityLevels: 'high'
  },
  {
    id: generateId(),
    name: '阳台',
    description: '露天，阳光充足',
    lightLevels: 'high',
    humidityLevels: 'low'
  }
]

export { generateId }
