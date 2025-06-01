<script setup lang="ts">
const timelineItems = [
  {
    title: "Q1 2025: Enhanced Analytics",
    status: "in-progress",
    description: "Comprehensive dashboard improvements with customizable widgets and performance metrics to help teams better understand their velocity and bottlenecks.",
    features: [
      "Team productivity analytics",
      "Sprint comparison charts",
      "Custom dashboard widgets",
      "Export and scheduled reports"
    ]
  },
  {
    title: "Q2 2025: Advanced Automations",
    status: "planned",
    description: "Powerful workflow automations to reduce manual work and ensure consistent processes across your projects.",
    features: [
      "Customizable workflow rules",
      "Trigger-based automations",
      "Status change notifications",
      "Integration with CI/CD pipelines"
    ]
  },
  {
    title: "Q3 2025: Resource Management",
    status: "planned",
    description: "Better tools for capacity planning and resource allocation to optimize your team's efficiency.",
    features: [
      "Team workload visualization",
      "Capacity planning tools",
      "Resource allocation dashboard",
      "Time tracking integration"
    ]
  },
  {
    title: "Q4 2024: Mobile Applications",
    status: "completed",
    description: "Native mobile applications for iOS and Android to manage your projects on the go.",
    features: [
      "Task creation and management",
      "Mobile notifications",
      "Offline support",
      "Quick updates and comments"
    ]
  },
  {
    title: "Q3 2024: Team Collaboration",
    status: "completed",
    description: "Enhanced collaboration features to improve team communication and coordination.",
    features: [
      "In-app messaging",
      "Comment threads and reactions",
      "Document collaboration",
      "Enhanced user permissions"
    ]
  }
];
</script>

<template>
  <section class="py-16 border-b border-b-secondary/10">
    <div>
      <div class="mx-auto max-w-4xl">
        <div class="mb-12 space-y-4">
          <h2 class="text-3xl font-bold">Development Timeline</h2>
          <p class="text-muted-foreground">
            Our product development is guided by user feedback and market trends. Here's what we've been working on and
            what's coming next.
          </p>
        </div>
        <div class="space-y-12">
          <div v-for="(item, index) in timelineItems" :key="index" class="relative border-l border-l-secondary/10 pl-8 pb-10">
            <div class="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full"
              :class="{
                'bg-primary/10': item.status === 'in-progress',
                'bg-secondary/10': item.status === 'planned',
                'bg-green-500/10': item.status === 'completed'
              }">
              <UIcon v-if="item.status === 'completed'" name="i-lucide-check" class="text-xs text-green-600" />
              <UIcon v-else-if="item.status === 'in-progress'" name="i-lucide-loader" class="text-xs text-primary animate-spin" />
              <UIcon v-else name="i-lucide-clock" class="text-xs text-primary" />
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-bold">{{ item.title }}</h3>
                <span class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="{
                    'bg-primary/10 text-primary': item.status === 'in-progress',
                    'bg-muted text-muted-foreground': item.status === 'planned',
                    'bg-green-500/10 text-green-600': item.status === 'completed'
                  }">
                  {{ item.status === 'in-progress' ? 'In Progress' : item.status === 'planned' ? 'Planned' : 'Completed' }}
                </span>
              </div>
              <UiText color="neutral">{{ item.description }}</UiText>
              <div class="pt-4">
                <h4 class="text-sm font-medium mb-2">Key Features:</h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="(feature, fIndex) in item.features" :key="fIndex" class="text-sm text-muted-foreground">
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>