import PermissionGuard from './PermissionGuard';
import { withPermissionGuard } from './withPermissionGuard';

export { default as PermissionProvider } from './PermissionProvider';
export { usePermissionValidator } from './context';
export { withPermissionRule } from './withPermissionRule';

// [NOTE]
// This is a workaround to make the `withPermissionGuard ` function available as a static method.
// Why put it in a separate object? Because the `withPermissionGuard ` function is available in the both client and server environments, so we can't put it in the `PermissionGuard` object
export default Object.assign(PermissionGuard, { protect: withPermissionGuard });
