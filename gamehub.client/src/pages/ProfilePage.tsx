// ProfilePage
// - Shows the current user's profile information and scores; requires authentication
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileScores from "../components/profile/ProfileScores";
import { useAuth } from "../hooks/useAuth";
import "../css/ProfilePage.css";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <main className="profilePage">
                <p>You must be logged in to view your profile.</p>
            </main>
        );
    }

    return (
        <main className="profilePage">
            <div className="profileLayout">
                <ProfileInfo />
                <ProfileScores />
            </div>
        </main>
    );
}