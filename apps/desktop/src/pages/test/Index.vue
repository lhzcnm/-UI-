<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex gap-2 p-4 border bg-card">
      <TheTheme />
    </div>

    <div class="flex gap-2 p-4 border">
      <XButton label="按钮" />
      <XButton variant="outline" label="按钮" />
      <XButton variant="soft" label="按钮" />
      <XButton variant="ghost" label="按钮" />
    </div>
    <div class="flex gap-2 p-4 border">
      <XButton color="emerald" label="按钮" />
      <XButton variant="outline" color="emerald" label="按钮" />
      <XButton variant="soft" color="emerald" label="按钮" />
      <XButton variant="ghost" color="emerald" label="按钮" />
    </div>
    <div class="flex gap-2 p-4 border">
      <XButton color="amber" label="按钮" />
      <XButton variant="outline" color="amber" label="按钮" />
      <XButton variant="soft" color="amber" label="按钮" />
      <XButton variant="ghost" color="amber" label="按钮" />
    </div>
    <div class="flex gap-2 p-4 border">
      <XButton color="rose" label="按钮" />
      <XButton variant="outline" color="rose" label="按钮" />
      <XButton variant="soft" color="rose" label="按钮" />
      <XButton variant="ghost" color="rose" label="按钮" />
    </div>
    <div class="flex gap-2 p-4 border">
      <XButton color="indigo" label="按钮" />
      <XButton variant="outline" color="indigo" label="按钮" />
      <XButton variant="soft" color="indigo" label="按钮" />
      <XButton variant="ghost" color="indigo" label="按钮" />
    </div>

    <div class="flex gap-2 p-4 border">
      <XButton label="按钮" disabled />
      <XButton color="emerald" label="按钮" disabled />
      <XButton color="amber" label="按钮" disabled />
      <XButton color="rose" label="按钮" disabled />
    </div>
    <div class="flex gap-2 p-4 border">
      <XButton size="sm" label="按钮" />

      <XButton size="md" label="按钮" />
    </div>

    <hr>
    <div class="flex gap-2 p-4 border">
      <XInput placeholder="请输入" />
    </div>
  </div>
</template>
