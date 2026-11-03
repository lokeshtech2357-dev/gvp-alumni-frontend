export default function RoleNotice({ userRole, allowedRoles, feature }) {
  if (!userRole) {
    return (
      <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-4 mb-6 text-yellow-900">
        <p className="font-semibold">Admin role required</p>
        <p className="text-sm">You need to be logged in with a valid admin role to access this panel.</p>
      </div>
    );
  }

  const friendlyRoles = allowedRoles.join(' or ');
  const isAllowed = allowedRoles.includes(userRole);

  return (
    <div className={`rounded-3xl p-4 mb-6 ${isAllowed ? 'border border-green-300 bg-emerald-50 text-emerald-900' : 'border border-red-300 bg-red-50 text-red-900'}`}>
      <p className="font-semibold">Current role: <span className="capitalize">{userRole}</span></p>
      <p className="text-sm mt-1">
        {isAllowed ? (
          <>You may manage <strong>{feature}</strong> with this role.</>
        ) : (
          <>This panel requires {friendlyRoles} access. Contact a super-admin to request permission.</>
        )}
      </p>
    </div>
  );
}
