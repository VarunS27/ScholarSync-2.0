require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Note = require('./models/Note');
const User = require('./models/User');
const Subject = require('./models/Subject');

const sampleNotes = [
  { title: 'Data Structures - Trees and Graphs', subject: 'Computer Science', description: 'Comprehensive notes on binary trees, AVL trees, and graph algorithms', tags: ['algorithms', 'trees', 'graphs'] },
  { title: 'Calculus I - Differentiation', subject: 'Mathematics', description: 'Complete guide to derivatives, limits, and applications', tags: ['calculus', 'derivatives', 'limits'] },
  { title: 'Organic Chemistry Reactions', subject: 'Chemistry', description: 'Major organic reactions with mechanisms and examples', tags: ['organic', 'reactions', 'mechanisms'] },
  { title: 'Cell Biology - Cellular Respiration', subject: 'Biology', description: 'Detailed notes on glycolysis, Krebs cycle, and electron transport chain', tags: ['cell', 'respiration', 'metabolism'] },
  { title: 'Quantum Mechanics Fundamentals', subject: 'Physics', description: 'Introduction to wave functions, operators, and the Schrödinger equation', tags: ['quantum', 'mechanics', 'physics'] },
  { title: 'Database Management Systems', subject: 'Computer Science', description: 'SQL, normalization, transactions, and database design principles', tags: ['database', 'sql', 'design'] },
  { title: 'Microeconomics - Supply and Demand', subject: 'Economics', description: 'Market equilibrium, elasticity, and consumer behavior analysis', tags: ['economics', 'markets', 'demand'] },
  { title: 'Shakespeare - Hamlet Analysis', subject: 'English Literature', description: 'Character analysis, themes, and literary devices in Hamlet', tags: ['shakespeare', 'drama', 'analysis'] },
  { title: 'Machine Learning Basics', subject: 'Computer Science', description: 'Supervised learning, neural networks, and common algorithms', tags: ['ml', 'ai', 'algorithms'] },
  { title: 'Thermodynamics Laws', subject: 'Physics', description: 'First, second, and third laws with practical applications', tags: ['thermodynamics', 'energy', 'laws'] },
  { title: 'Financial Accounting Principles', subject: 'Business', description: 'Balance sheets, income statements, and cash flow analysis', tags: ['accounting', 'finance', 'business'] },
  { title: 'World War II History', subject: 'History', description: 'Causes, major events, and consequences of World War II', tags: ['history', 'war', 'modern'] },
  { title: 'Human Anatomy - Cardiovascular System', subject: 'Medicine', description: 'Heart structure, blood vessels, and circulation', tags: ['anatomy', 'heart', 'medicine'] },
  { title: 'Python Programming Basics', subject: 'Computer Science', description: 'Variables, loops, functions, and object-oriented programming', tags: ['python', 'programming', 'oop'] },
  { title: 'Environmental Conservation', subject: 'Environmental Science', description: 'Biodiversity, ecosystems, and conservation strategies', tags: ['environment', 'conservation', 'ecology'] },
];

const seedNotes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create demo user
    let demoUser = await User.findOne({ email: 'demo@scholarsync.com' });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@scholarsync.com',
        passwordHash: hashedPassword,
      });
      console.log('✅ Created demo user');
    }

    // Get all subjects
    const subjects = await Subject.find();
    if (subjects.length === 0) {
      console.log('❌ No subjects found. Please run seedSubjects.js first');
      process.exit(1);
    }

    // Clear existing notes
    await Note.deleteMany({});
    console.log('🗑️  Cleared existing notes');

    // Create subject map
    const subjectMap = {};
    subjects.forEach(s => {
      subjectMap[s.name] = s._id;
    });

    // Create notes
    const notes = [];
    for (const noteData of sampleNotes) {
      notes.push({
        title: noteData.title,
        description: noteData.description,
        subject: noteData.subject, // Use subject name directly
        uploaderId: demoUser._id,
        tags: noteData.tags,
        fileUrl: `/api/files/demo-file-${Math.random().toString(36).substr(2, 9)}`,
        fileKey: `demo-${Math.random().toString(36).substr(2, 9)}`,
        fileType: 'application/pdf',
        fileSize: Math.floor(Math.random() * 5000000) + 500000,
        allowDownload: true,
        views: Math.floor(Math.random() * 500),
        likes: [],
      });
    }

    const createdNotes = await Note.insertMany(notes);
    console.log(`✅ Created ${createdNotes.length} sample notes`);

    console.log('\n📝 Sample notes created successfully!');
    console.log(`Demo user credentials:\nEmail: demo@scholarsync.com\nPassword: demo123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding notes:', error);
    process.exit(1);
  }
};

seedNotes();
