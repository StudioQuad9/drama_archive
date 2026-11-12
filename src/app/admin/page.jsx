import AdminAccess from "./AdminAccess";

export const metadata = {
  title: "記事管理",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminAccess />;
}
