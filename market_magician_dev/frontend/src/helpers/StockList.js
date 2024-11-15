import AppleIcon from '@mui/icons-material/Apple';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon } from '@fortawesome/free-brands-svg-icons';
import { faMeta } from '@fortawesome/free-brands-svg-icons/faMeta';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ReactComponent as TeslaIcon } from '../assets/images/tesla.svg';
import { ReactComponent as NetflixIcon } from '../assets/images/netflix.svg';

export const StockList = [
    {
        name: "Apple",
        ticker: "AAPL", // Stock ticker symbol
        image: AppleIcon,
        Risk: "Low",
        Buy: "Buy Strong"
    },
    {
        name: "Microsoft",
        ticker: "MSFT",  // Stock ticker symbol
        image: MicrosoftIcon,
        Risk: "Medium",
        Buy: " Buy"
    },
    {
        name: "Tesla",
        ticker: "TSLA",  // Stock ticker symbol
        image: TeslaIcon,
        Risk: "High",
        Buy: "Hold"
    },
    {
        name: "Amazon",
        ticker: "AMZN",  // Stock ticker symbol
        image: FontAwesomeIcon,
        Risk: "Medium",
        Buy: "Buy",
        icon: faAmazon
    },
    {
        name: "Meta",
        ticker: "META",  // Stock ticker symbol
        image: FontAwesomeIcon,
        Risk: "Low",
        Buy: "Buy",
        icon: faMeta
    },
    {
        name: "Google",
        ticker: "GOOGL",  // Stock ticker symbol
        image: FontAwesomeIcon,
        Risk: "Medium",
        Buy: "Buy",
        icon: faGoogle
    },
    {
        name: "Netflix",
        ticker: "NFLX",  // Stock ticker symbol
        image: NetflixIcon,
        Risk: "High",
        Buy: "Buy",
    }

]
