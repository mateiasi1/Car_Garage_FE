import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import style from './home.module.scss';
import { AuthContext } from '../../contexts/authContext';
import HomeNotAuthenticated from './home-not-authenticated';

const Home: FC = () => {
    const { t } = useTranslation();

    const { isAuthenticated } = useContext(AuthContext);

    const cards = [
        { id: 1, title: t('upcomingInspections'), description: t('card1.description'), bgColor: 'bg-red-200', href: '/inspections/upcoming' },
        { id: 2, title: t('smsSentToday'), description: t('card2.description'), bgColor: 'bg-orange-200', href: '/inspections/daily'  },
        { id: 3, title: t('smsSentThisMonth'), description: t('card3.description'), bgColor: 'bg-yellow-200', href: '/inspections/monthly'  },
        { id: 4, title: t('newlyAddedCustomersThisMonth'), description: t('card4.description'), bgColor: 'bg-green-200', href: '/inspections/upcoming'  },
        // Add more cards as needed
    ];

    return (
        <div>
            {isAuthenticated ?
        <div className="flex flex-col items-center h-screen p-4">
            <h1 className="text-3xl font-semibold mb-8">{t('dashboard')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {cards.map(card => (
                    <Link to={card.href} className={style.customLink} key={card.id}>
                        <div
                            className={`${card.bgColor} shadow-md rounded-lg p-6`}
                            title={card.title}
                            style={{ transition: 'box-shadow 0.3s ease' }}
                        >
                            <h2 className="text-xl font-bold mb-2 w-56 h-16 truncate">{card.title}</h2>
                            <p className="text-gray-700">{card.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        : <HomeNotAuthenticated />}
        </div>
    );
};

export default Home;
