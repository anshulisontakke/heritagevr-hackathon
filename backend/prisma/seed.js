import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HeritageVR database...\n');

  // Clear existing data
  await prisma.fundTransaction.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.vRExperience.deleteMany();
  await prisma.heritageComponent.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.heritageSite.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'HeritageVR Admin',
      email: 'admin@heritagevr.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created: admin@heritagevr.com / Admin@123');

  // Create Demo user
  const userPassword = await bcrypt.hash('User@123', 12);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Arjun Sharma',
      email: 'user@heritagevr.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ Demo user created: user@heritagevr.com / User@123');

  // Create additional users
  const user2 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      passwordHash: await bcrypt.hash('User@123', 12),
      role: 'USER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Rahul Mehta',
      email: 'rahul@example.com',
      passwordHash: await bcrypt.hash('User@123', 12),
      role: 'USER',
    },
  });

  // Heritage Sites
  const sites = await Promise.all([
    prisma.heritageSite.create({
      data: {
        name: 'Hampi Virupaksha Temple Complex',
        location: 'Hampi, Karnataka, India',
        description: 'The Virupaksha Temple is part of the Group of Monuments at Hampi, a UNESCO World Heritage Site. This ancient temple complex dates back to the 7th century and represents the pinnacle of Vijayanagara architecture.',
        historicalInfo: 'Built during the reign of the Vijayanagara Empire, the Virupaksha Temple has been in continuous worship since its inception. The temple complex showcases intricate Dravidian architecture with towering gopurams, mandapas, and elaborate stone carvings depicting scenes from Hindu mythology. The main tower rises 50 meters and is adorned with detailed sculptures.',
        currentCondition: 'While the main temple structure remains intact, several peripheral structures and mandapas show significant weathering and structural damage. The ornate carvings on the outer walls are eroding due to environmental exposure, and some sections of the complex require urgent stabilization.',
        period: '7th Century CE - Vijayanagara Empire',
        fundingGoal: 1500000,
        fundingRaised: 875000,
        preservationStatus: 'Under Restoration',
        heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb4020696?w=1200',
        thenImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
        nowImage: 'https://images.unsplash.com/photo-1590050752117-238cb4020696?w=800',
        latitude: 15.3350,
        longitude: 76.4600,
        supporters: 342,
        featured: true,
      },
    }),
    prisma.heritageSite.create({
      data: {
        name: 'Rani ki Vav — The Queen\'s Stepwell',
        location: 'Patan, Gujarat, India',
        description: 'Rani ki Vav is an intricately constructed stepwell situated on the banks of the Saraswati River. Built in the 11th century as a memorial to King Bhimdev I, it is a UNESCO World Heritage Site known for its stunning sculptural panels.',
        historicalInfo: 'Commissioned by Queen Udayamati in memory of her husband Bhimdev I of the Solanki dynasty around 1063 CE. The stepwell is designed as an inverted temple, highlighting the sanctity of water. It contains over 800 elaborate sculptures organized on seven levels of stairs, primarily dedicated to Vishnu in his various forms.',
        currentCondition: 'The stepwell was buried under silt for centuries and was excavated in the 1980s. While the main structure has been remarkably preserved, many sculptural elements show damage from centuries of submersion. The lower levels require careful conservation to prevent further deterioration.',
        period: '11th Century CE - Solanki Dynasty',
        fundingGoal: 1000000,
        fundingRaised: 650000,
        preservationStatus: 'At Risk',
        heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200',
        thenImage: 'https://images.unsplash.com/photo-1585135497273-1a86d9d1e3c2?w=800',
        nowImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        latitude: 23.8589,
        longitude: 72.1017,
        supporters: 218,
        featured: true,
      },
    }),
    prisma.heritageSite.create({
      data: {
        name: 'Konark Sun Temple',
        location: 'Konark, Odisha, India',
        description: 'The Konark Sun Temple is a 13th-century CE Sun temple at Konark, Odisha. It is attributed to King Narasimhadeva I of the Eastern Ganga dynasty. The temple is designed in the shape of a colossal chariot with elaborately carved stone wheels, pillars, and walls.',
        historicalInfo: 'Built circa 1250 CE by King Narasimhadeva I, the temple was conceived as a giant stone chariot of the Sun God Surya with 24 intricately carved wheels, dragged by seven horses. It represents the pinnacle of Kalinga architecture and is renowned for its architectural grandeur and rich sculptural work.',
        currentCondition: 'Much of the original temple has collapsed over the centuries. The jagamohana (audience hall) remains standing, while the vimana (sanctum) has largely crumbled. The British filled the jagamohana with sand and sealed it to prevent collapse. Many exterior sculptures face severe weathering.',
        period: '13th Century CE - Eastern Ganga Dynasty',
        fundingGoal: 2000000,
        fundingRaised: 480000,
        preservationStatus: 'Critical',
        heroImage: 'https://images.unsplash.com/photo-1621427639676-ae1b8721e7e9?w=1200',
        thenImage: 'https://images.unsplash.com/photo-1621427639676-ae1b8721e7e9?w=800',
        nowImage: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800',
        latitude: 19.8876,
        longitude: 86.0945,
        supporters: 156,
        featured: true,
      },
    }),
    prisma.heritageSite.create({
      data: {
        name: 'Chand Baori Stepwell',
        location: 'Abhaneri, Rajasthan, India',
        description: 'Chand Baori is one of the largest and deepest stepwells in India, with 3,500 narrow steps arranged in a perfect geometric pattern descending 13 stories deep. It is a masterpiece of ancient Indian engineering.',
        historicalInfo: 'Built between 800-900 CE by King Chanda of the Nikumbha dynasty, Chand Baori was designed to address the region\'s chronic water shortage. The stepwell\'s extraordinary depth of approximately 20 meters (66 feet) and its 13 stories of steps were engineered to reach the water table. The geometric precision of the 3,500 steps creates a stunning visual pattern.',
        currentCondition: 'The stepwell structure is largely intact but shows signs of aging. Several steps have eroded, and the intricate carvings along the galleries require conservation. Water seepage and algae growth threaten the lower levels. The surrounding pavilion and temple structures need stabilization.',
        period: '8th-9th Century CE - Nikumbha Dynasty',
        fundingGoal: 800000,
        fundingRaised: 320000,
        preservationStatus: 'At Risk',
        heroImage: 'https://images.unsplash.com/photo-1597040663342-45b6af3d7489?w=1200',
        thenImage: 'https://images.unsplash.com/photo-1597040663342-45b6af3d7489?w=800',
        nowImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        latitude: 27.0074,
        longitude: 76.6073,
        supporters: 95,
        featured: false,
      },
    }),
    prisma.heritageSite.create({
      data: {
        name: 'Modhera Sun Temple',
        location: 'Modhera, Gujarat, India',
        description: 'The Modhera Sun Temple is an early 11th-century Hindu temple dedicated to the solar deity Surya. It stands on the banks of the Pushpavati River and is known for its stunning architecture and intricate carvings.',
        historicalInfo: 'Built in 1026-27 CE during the reign of Bhima I of the Chaulukya dynasty, the temple is designed so that the sun\'s rays illuminate the inner sanctum during the equinoxes. The complex comprises the shrine hall (Guda Mandapa), the assembly hall (Sabha Mandapa), and the Surya Kund — a magnificent stepped tank with 108 miniature shrines.',
        currentCondition: 'The temple is no longer an active place of worship. While the main structures are well-preserved, the intricate sculptural details on the exterior are weathering. The Surya Kund has been partially restored, but several miniature shrines around it need attention. The interior carvings remain exquisite but are threatened by moisture damage.',
        period: '11th Century CE - Chaulukya Dynasty',
        fundingGoal: 1200000,
        fundingRaised: 540000,
        preservationStatus: 'Under Restoration',
        heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200',
        thenImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        nowImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
        latitude: 23.5833,
        longitude: 72.1333,
        supporters: 187,
        featured: true,
      },
    }),
  ]);

  console.log(`✅ Created ${sites.length} heritage sites`);

  // Create components for each site
  const componentTemplates = [
    [
      { name: 'Main Gopuram (Tower)', type: 'pillar', restorationCost: 250000, amountFunded: 175000, condition: 'Fair', description: 'The towering main entrance gateway, standing 50 meters tall with intricate carvings' },
      { name: 'North Mandapa Pillars', type: 'pillar', restorationCost: 80000, amountFunded: 45000, condition: 'Deteriorating', description: 'A set of ornately carved pillars in the northern assembly hall' },
      { name: 'Inner Sanctum Wall', type: 'wall', restorationCost: 120000, amountFunded: 90000, condition: 'Fair', description: 'The sacred walls of the garbhagriha featuring divine sculptures' },
      { name: 'Eastern Gateway Arch', type: 'arch', restorationCost: 65000, amountFunded: 30000, condition: 'Critical', description: 'The ceremonial archway on the eastern entrance of the complex' },
    ],
    [
      { name: 'Central Shaft Sculptures', type: 'statue', restorationCost: 180000, amountFunded: 120000, condition: 'Deteriorating', description: 'Elaborate Vishnu sculptures along the central descent' },
      { name: 'Third Level Stone Gallery', type: 'wall', restorationCost: 95000, amountFunded: 55000, condition: 'Critical', description: 'Carved stone panels depicting apsaras and celestial beings' },
      { name: 'Entrance Torana (Gateway)', type: 'arch', restorationCost: 75000, amountFunded: 40000, condition: 'Deteriorating', description: 'The ornamental gateway at the stepwell entrance' },
      { name: 'Base Level Pavilion', type: 'roof', restorationCost: 110000, amountFunded: 60000, condition: 'Critical', description: 'The deepest level pavilion structure near the water source' },
    ],
    [
      { name: 'Chariot Wheel — South Face', type: 'stone', restorationCost: 200000, amountFunded: 85000, condition: 'Critical', description: 'One of the iconic 24 carved stone wheels, 3 meters in diameter' },
      { name: 'Horse Sculpture — Lead Pair', type: 'statue', restorationCost: 150000, amountFunded: 70000, condition: 'Deteriorating', description: 'The majestic lead pair of seven stone horses drawing the chariot' },
      { name: 'Nata Mandapa Roof', type: 'roof', restorationCost: 180000, amountFunded: 45000, condition: 'Critical', description: 'The dance hall roof section with its remarkable ceiling carvings' },
      { name: 'Western Wall Relief Panel', type: 'wall', restorationCost: 95000, amountFunded: 35000, condition: 'Deteriorating', description: 'Intricately carved relief panels depicting daily life and mythology' },
    ],
    [
      { name: 'Upper Gallery Carvings', type: 'wall', restorationCost: 85000, amountFunded: 40000, condition: 'Deteriorating', description: 'Carved gallery panels on the upper levels of the stepwell' },
      { name: 'Central Stairway Steps', type: 'stone', restorationCost: 120000, amountFunded: 55000, condition: 'Fair', description: 'The geometric central descending stairway with 3,500 steps' },
      { name: 'Harshat Mata Temple Pillars', type: 'pillar', restorationCost: 70000, amountFunded: 25000, condition: 'Critical', description: 'Pillars of the adjacent temple with intricate carvings' },
      { name: 'Corner Pavilion Roof', type: 'roof', restorationCost: 60000, amountFunded: 20000, condition: 'Deteriorating', description: 'Small decorative pavilion at the corner of the stepwell' },
    ],
    [
      { name: 'Sabha Mandapa Ceiling', type: 'roof', restorationCost: 160000, amountFunded: 85000, condition: 'Fair', description: 'The intricately carved ceiling of the assembly hall' },
      { name: 'Surya Kund Shrine #47', type: 'stone', restorationCost: 45000, amountFunded: 20000, condition: 'Deteriorating', description: 'One of 108 miniature shrines surrounding the stepped tank' },
      { name: 'Main Entrance Door Frame', type: 'door', restorationCost: 90000, amountFunded: 55000, condition: 'Fair', description: 'The elaborately carved stone door frame of the main shrine' },
      { name: 'Guda Mandapa Exterior Wall', type: 'wall', restorationCost: 130000, amountFunded: 70000, condition: 'Deteriorating', description: 'Exterior wall panels of the shrine hall with erotic and divine sculptures' },
    ],
  ];

  const allComponents = [];
  for (let i = 0; i < sites.length; i++) {
    for (const comp of componentTemplates[i]) {
      const component = await prisma.heritageComponent.create({
        data: {
          siteId: sites[i].id,
          ...comp,
        },
      });
      allComponents.push(component);
    }
  }
  console.log(`✅ Created ${allComponents.length} heritage components`);

  // Create VR Experiences
  for (const site of sites) {
    await prisma.vRExperience.create({
      data: {
        siteId: site.id,
        description: `Immersive virtual tour of ${site.name}. Explore the architecture, sculptures, and history through an interactive 3D experience.`,
        hotspots: JSON.stringify([
          { id: 1, position: [0, 1.5, -3], label: 'Main Entrance', description: 'The grand entrance to the heritage site' },
          { id: 2, position: [2, 1, -1], label: 'Sculptural Details', description: 'Intricate carvings and sculptures' },
          { id: 3, position: [-2, 2, 0], label: 'Architectural Marvel', description: 'Remarkable architectural elements' },
        ]),
        settings: JSON.stringify({ ambientLight: 0.6, fogDensity: 0.01, skyColor: '#87CEEB' }),
      },
    });
  }
  console.log('✅ Created VR experiences');

  // Create Donations
  const users = [demoUser, user2, user3];
  const donationData = [
    { userId: demoUser.id, siteId: sites[0].id, componentId: allComponents[0].id, amount: 5000, paymentStatus: 'success', donationType: 'adoption' },
    { userId: demoUser.id, siteId: sites[1].id, amount: 2500, paymentStatus: 'success', donationType: 'general' },
    { userId: demoUser.id, siteId: sites[2].id, componentId: allComponents[8].id, amount: 1000, paymentStatus: 'success', donationType: 'adoption' },
    { userId: user2.id, siteId: sites[0].id, amount: 10000, paymentStatus: 'success', donationType: 'general' },
    { userId: user2.id, siteId: sites[3].id, componentId: allComponents[12].id, amount: 3000, paymentStatus: 'success', donationType: 'adoption' },
    { userId: user2.id, siteId: sites[4].id, amount: 500, paymentStatus: 'success', donationType: 'general' },
    { userId: user3.id, siteId: sites[1].id, componentId: allComponents[5].id, amount: 7500, paymentStatus: 'success', donationType: 'adoption' },
    { userId: user3.id, siteId: sites[2].id, amount: 1500, paymentStatus: 'success', donationType: 'general' },
    { userId: user3.id, siteId: sites[0].id, amount: 2000, paymentStatus: 'failed', donationType: 'general' },
    { userId: demoUser.id, siteId: sites[4].id, componentId: allComponents[17].id, amount: 4000, paymentStatus: 'success', donationType: 'adoption' },
    { userId: user2.id, siteId: sites[2].id, componentId: allComponents[10].id, amount: 6000, paymentStatus: 'success', donationType: 'adoption' },
    { userId: user3.id, siteId: sites[3].id, amount: 800, paymentStatus: 'success', donationType: 'general' },
  ];

  for (const d of donationData) {
    await prisma.donation.create({
      data: {
        ...d,
        currency: 'INR',
        razorpayOrderId: d.paymentStatus === 'success' ? `order_demo_${Math.random().toString(36).substring(7)}` : null,
        razorpayPaymentId: d.paymentStatus === 'success' ? `pay_demo_${Math.random().toString(36).substring(7)}` : null,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      },
    });
  }
  console.log(`✅ Created ${donationData.length} donation records`);

  // Create Fund Transactions
  const txTypes = ['donation_received', 'fund_allocated', 'restoration_started', 'restoration_completed'];
  const fundTxData = [
    { siteId: sites[0].id, amount: 200000, type: 'donation_received', description: 'Crowdfunding milestone — Phase 1 target reached' },
    { siteId: sites[0].id, amount: 150000, type: 'fund_allocated', description: 'Funds allocated for Main Gopuram restoration phase 1' },
    { siteId: sites[0].id, amount: 0, type: 'restoration_started', description: 'Restoration work commenced on Main Gopuram' },
    { siteId: sites[1].id, amount: 300000, type: 'donation_received', description: 'Heritage trust matching fund received' },
    { siteId: sites[1].id, amount: 250000, type: 'fund_allocated', description: 'Funds allocated for Central Shaft sculpture conservation' },
    { siteId: sites[2].id, amount: 100000, type: 'donation_received', description: 'Online donations milestone reached' },
    { siteId: sites[4].id, amount: 180000, type: 'donation_received', description: 'Corporate sponsorship received for Sabha Mandapa' },
    { siteId: sites[4].id, amount: 150000, type: 'fund_allocated', description: 'Funds allocated for Sabha Mandapa ceiling restoration' },
    { siteId: sites[4].id, amount: 0, type: 'restoration_started', description: 'Conservation experts begin Sabha Mandapa work' },
  ];

  for (let i = 0; i < fundTxData.length; i++) {
    await prisma.fundTransaction.create({
      data: {
        ...fundTxData[i],
        createdAt: new Date(Date.now() - (fundTxData.length - i) * 3 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ Created fund transactions');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: admin@heritagevr.com / Admin@123');
  console.log('   User:  user@heritagevr.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
