// Re-export the CRM page as a component for use in agents/page.tsx
// Note: Importing Next.js pages as components is not recommended
// This is a workaround - the CRM page should ideally be refactored into a separate component
import CrmPage from '../crm/page';
export { CrmPage as IntegratedCrmDashboard };
