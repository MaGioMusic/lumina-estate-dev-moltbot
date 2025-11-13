import type { ProfileAgentSummary } from '@/types/profile';

const AGENTS: ProfileAgentSummary[] = [
  {
    id: 'agent-04',
    name: 'სოფო კალანდაძე',
    avatarUrl: '/images/photos/Agents/agent-2.jpg',
    phone: '+995 595 222 333',
    email: 'sopo.kalandadze@luminaestate.ge',
    companyName: 'Lumina Estate',
    rating: 4.8,
  },
  {
    id: 'agent-03',
    name: 'თამარ ლომიძე',
    avatarUrl: '/images/photos/Agents/agent-3.jpg',
    phone: '+995 598 777 888',
    email: 'tamar.lomidze@luminaestate.ge',
    companyName: 'Lumina Estate',
    rating: 4.6,
  },
];

export function listMockAgents() {
  return AGENTS;
}

export function autoAssignAgentByDistrict(district?: string | null): ProfileAgentSummary {
  if (!district) return AGENTS[0];

  const normalized = district.toLowerCase();
  if (['vake', 'mtatsminda', 'saburtalo'].includes(normalized)) {
    return AGENTS[0];
  }

  return AGENTS[1] ?? AGENTS[0];
}
