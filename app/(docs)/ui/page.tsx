import React from 'react';
import Button from '../../../components/ui/button';
import Card from '../../../components/ui/card';
import Input from '../../../components/ui/input';

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">UI components</h1>
      <section className="space-y-4 mb-8">
        <h2 className="text-lg">Buttons</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-lg">Cards</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>Default Card</Card>
          <Card variant="elevated" padding="lg">Elevated Card</Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg">Inputs</h2>
        <div className="max-w-sm">
          <Input placeholder="normal" />
          <Input placeholder="with error" error className="mt-2" />
        </div>
      </section>
    </div>
  );
}