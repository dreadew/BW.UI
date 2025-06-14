<script setup lang="ts">
defineProps<{
  slug: string;
}>();

const post = {
  title: 'Maximizing Team Productivity with Agile Methodologies',
  date: '2024-02-15',
  author: {
    name: 'Alexandra Chen',
    avatar: '/team/member1.jpg',
    title: 'Co-Founder & CEO'
  },
  category: 'Productivity',
  image: '/blog/productivity.jpg',
  content: `
    <p class="lead">As agile methodologies continue to dominate the software development landscape, teams across industries are adopting these practices to increase productivity and deliver value faster.</p>
    
    <p>However, simply adopting agile practices doesn't automatically lead to productivity gains. Teams need to implement these practices thoughtfully and adapt them to their specific context.</p>
    
    <h2>Understanding Productivity in Agile Teams</h2>
    
    <p>Traditional measures of productivity often focus on output—lines of code written, features completed, or hours worked. Agile shifts this focus to outcomes—the value delivered to customers and the business.</p>
    
    <p>This shift requires a different approach to measuring and improving productivity:</p>
    
    <ul>
      <li>Focus on delivering working software that provides value</li>
      <li>Prioritize collaboration over individual heroics</li>
      <li>Embrace continuous improvement through regular retrospectives</li>
      <li>Remove impediments that slow down the team</li>
    </ul>
    
    <h2>Key Practices for Maximizing Team Productivity</h2>
    
    <h3>1. Effective Backlog Refinement</h3>
    
    <p>A well-maintained and prioritized backlog is essential for team productivity. Regular refinement sessions help the team understand upcoming work, break down complex items, and prepare for implementation. This reduces confusion and delays when work begins.</p>
    
    <h3>2. Cross-Functional Collaboration</h3>
    
    <p>When team members with different skills collaborate closely, they can solve problems faster and deliver more integrated solutions. Encourage pair programming, design reviews, and collective ownership of quality.</p>
    
    <h3>3. Automated Testing and Continuous Integration</h3>
    
    <p>Manual testing and integration are time-consuming and error-prone. Investing in test automation and continuous integration/delivery pipelines significantly reduces rework and accelerates delivery.</p>
    
    <h2>Overcoming Common Challenges</h2>
    
    <p>Even experienced agile teams encounter challenges that impact productivity:</p>
    
    <h3>Interruptions and Context Switching</h3>
    
    <p>Frequent interruptions can drastically reduce productivity. Implement practices like focus time, where team members can work without interruption for designated periods.</p>
    
    <h3>Technical Debt</h3>
    
    <p>Accumulating technical debt slows down development over time. Allocate time in each sprint to address technical debt and prevent it from growing.</p>
    
    <h3>Unclear Requirements</h3>
    
    <p>When requirements are ambiguous, teams waste time on rework. Use techniques like example mapping, specification by example, or user story mapping to clarify requirements before development begins.</p>
    
    <h2>Measuring Improvement</h2>
    
    <p>To know if your productivity initiatives are working, consider tracking these metrics:</p>
    
    <ul>
      <li>Cycle Time: How long it takes for a work item to move from "in progress" to "done"</li>
      <li>Lead Time: The total time from when a request is made until it's delivered</li>
      <li>Flow Efficiency: The ratio of active work time to total time</li>
      <li>Team Happiness: Regular surveys to gauge team satisfaction and engagement</li>
    </ul>
    
    <h2>Conclusion</h2>
    
    <p>Maximizing productivity in agile teams isn't about working harder—it's about working smarter. By focusing on effective collaboration, removing impediments, and continuously improving, teams can deliver more value with less stress.</p>
    
    <p>Remember that productivity improvements take time, and sustainable pace is key. Pushing a team too hard leads to burnout, which ultimately reduces productivity over the long term.</p>
  `,
  tags: ['Agile', 'Productivity', 'Team Management', 'Scrum', 'Kanban']
};
</script>

<template>
  <div>
    <div class="w-full h-96 bg-muted relative">
      <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
    </div>

    <div class="py-16">
      <div class="mx-auto max-w-3xl">
        <div class="mb-8">
          <div class="mb-4">
            <UiText as="span"
              class="inline-block bg-primary rounded-full px-3 py-1 text-xs font-medium text-primary-foreground mb-4">
              {{ post.category }}
            </UiText>
            <UiHeading level="1" size="4xl" class="mb-4">{{ post.title }}</UiHeading>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img :src="post.author.avatar" :alt="post.author.name" class="h-10 w-10 rounded-full object-cover" />
                <div>
                  <UiText as="div" class="font-medium">{{ post.author.name }}</UiText>
                  <UiText as="div" class="text-sm text-muted-foreground">{{ post.author.title }}</UiText>
                </div>
              </div>
              <UiText as="time" class="text-sm text-muted-foreground">{{ new Date(post.date).toLocaleDateString('en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }) }}</UiText>
            </div>
          </div>
        </div>

        <div class="prose prose-lg max-w-none" v-html="post.content"></div>

        <div class="mt-12 pt-6 border-t">
          <div class="flex flex-wrap gap-2">
            <UiText as="span" v-for="tag in post.tags" :key="tag"
              class="bg-secondary rounded-full px-3 py-1 text-xs font-medium text-secondary-foreground">
              # {{ tag }}
            </UiText>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UButton variant="ghost" size="sm" class="rounded-full p-2 h-8 w-8">
              <UIcon name="i-lucide-twitter" class="text-base" />
            </UButton>
            <UButton variant="ghost" size="sm" class="rounded-full p-2 h-8 w-8">
              <UIcon name="i-lucide-facebook" class="text-base" />
            </UButton>
            <UButton variant="ghost" size="sm" class="rounded-full p-2 h-8 w-8">
              <UIcon name="i-lucide-linkedin" class="text-base" />
            </UButton>
          </div>

          <div>
            <ULink to="/blog">
              <UButton variant="outline">
                <UIcon name="i-lucide-arrow-left" class="mr-2 text-base" />
                Back to Blog
              </UButton>
            </ULink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>