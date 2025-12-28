import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/login/$phoneNumber/otp")({
    component: RouteComponent,
});

function RouteComponent() {
    const { phoneNumber } = Route.useParams();
    return <div>{phoneNumber}</div>;
}
