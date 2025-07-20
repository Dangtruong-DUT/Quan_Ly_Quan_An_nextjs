import Layout from "@/app/[locale]/(public)/layout";

function GuestLayout({ children }: { children: React.ReactNode }) {
    return <Layout modal={null}>{children}</Layout>;
}

export default GuestLayout;
