import { Button } from "@react-email/components";

export default function VerifyEmail() {
    return (
        <div className="bg-white p-8 rounded-lg max-w-sm mx-auto my-12">
            <h1 className="text-2xl font-bold text-center mt-6">Welcome to ACME, user!</h1>
            <p className="mt-4 text-sm text-gray-600">
                Hello newuser,
                <br />
                We're excited to have you onboard at ACME. We hope you enjoy your journey with us. If you have any questions or
                need assistance, feel free to reach out.
            </p>
            <div className="mt-6">
                <Button className="w-full">Get Started</Button>
            </div>
            <p className="mt-6 text-sm text-center text-gray-600">
                Cheers,
                <br />
                The ACME Team
            </p>
        </div>
    )
} 