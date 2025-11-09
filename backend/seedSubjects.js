require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('./models/Subject');

const subjects = [
  { name: 'Computer Science', description: 'Programming, algorithms, data structures, and software engineering' },
  { name: 'Mathematics', description: 'Calculus, algebra, statistics, and applied mathematics' },
  { name: 'Physics', description: 'Classical mechanics, quantum physics, and thermodynamics' },
  { name: 'Chemistry', description: 'Organic, inorganic, and physical chemistry' },
  { name: 'Biology', description: 'Cell biology, genetics, ecology, and microbiology' },
  { name: 'Engineering', description: 'Mechanical, electrical, civil, and chemical engineering' },
  { name: 'Business', description: 'Management, marketing, finance, and entrepreneurship' },
  { name: 'Economics', description: 'Microeconomics, macroeconomics, and econometrics' },
  { name: 'Psychology', description: 'Cognitive, developmental, and clinical psychology' },
  { name: 'English Literature', description: 'Poetry, prose, drama, and literary analysis' },
  { name: 'History', description: 'World history, ancient civilizations, and modern history' },
  { name: 'Philosophy', description: 'Ethics, logic, metaphysics, and epistemology' },
  { name: 'Law', description: 'Constitutional law, criminal law, and civil law' },
  { name: 'Medicine', description: 'Anatomy, physiology, pathology, and pharmacology' },
  { name: 'Environmental Science', description: 'Ecology, conservation, and sustainability' },
  { name: 'Political Science', description: 'Government, political theory, and international relations' },
  { name: 'Sociology', description: 'Social structures, cultures, and human behavior' },
  { name: 'Art & Design', description: 'Visual arts, graphic design, and art history' },
];

const seedSubjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('🗑️  Cleared existing subjects');

    // Insert new subjects
    const createdSubjects = await Subject.insertMany(subjects);
    console.log(`✅ Created ${createdSubjects.length} subjects`);

    console.log('\n📚 Subjects created:');
    createdSubjects.forEach((subject, index) => {
      console.log(`${index + 1}. ${subject.name} (ID: ${subject._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    process.exit(1);
  }
};

seedSubjects();
