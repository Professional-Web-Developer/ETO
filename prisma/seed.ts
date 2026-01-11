import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // create sample users / agents
  const [alice, bob] = await Promise.all([
    prisma.user.upsert({ where: { email: 'alice@example.com' }, update: {}, create: { name: 'Alice', email: 'alice@example.com', role: 'AGENT' } }),
    prisma.user.upsert({ where: { email: 'bob@example.com' }, update: {}, create: { name: 'Bob', email: 'bob@example.com', role: 'AGENT' } })
  ]);

  // seed some cash entries
  await prisma.cashEntry.createMany({
    data: [
      { agentId: alice.id, type: 'IN', amount: 1000.0, category: 'Salary', note: 'Monthly salary', timestamp: new Date() },
      { agentId: alice.id, type: 'OUT', amount: 150.0, category: 'Groceries', note: 'Weekly groceries', timestamp: new Date() },
      { agentId: bob.id, type: 'IN', amount: 500.0, category: 'Freelance', note: 'Proj A', timestamp: new Date() }
    ]
  });

  // seed obligations
  await prisma.obligation.create({ data: { agentId: alice.id, counterparty: 'John Doe', amount: 200.0, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

  // seed lending
  await prisma.lending.create({ data: { agentId: bob.id, direction: 'GIVEN', person: 'Charlie', amount: 300.0 } });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });