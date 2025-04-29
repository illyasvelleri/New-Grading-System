import UserHeader from '@/components/UserHeader';

export default function Settings() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-tr from-blue-50 via-gray-50 to-white text-xs sm:text-sm text-gray-700">
            <UserHeader />
            <p className='mt-24 ms-6 text-center'>Page Not Available Now</p>
        </div>
    )
}