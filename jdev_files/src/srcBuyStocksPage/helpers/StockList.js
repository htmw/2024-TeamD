import AppleIcon from '@mui/icons-material/Apple';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmazon } from '@fortawesome/free-brands-svg-icons';
import { faMeta } from '@fortawesome/free-brands-svg-icons/faMeta';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ReactComponent as TeslaIcon } from '../assets/tesla.svg';
import { ReactComponent as NetflixIcon } from '../assets/netflix.svg';

export const StockList = [
    {
        name: "Apple",
        image: AppleIcon,
        Risk: "Low",
        Buy: "Buy Strong"
    },
    {
        name: "Microsoft",
        image: MicrosoftIcon,
        Risk: "Medium",
        Buy: " Buy"
    },
    {
        name: "Tesla",
        image: TeslaIcon,
        Risk: "High",
        Buy: "Hold"
    },
    {
        name: "Amazon",
        image: FontAwesomeIcon,
        Risk: "Medium",
        Buy: "Buy",
        icon: faAmazon
    },
    {
        name: "Meta",
        image: FontAwesomeIcon,
        Risk: "Low",
        Buy: "Buy",
        icon: faMeta
    },
    {
        name: "Google",
        image: FontAwesomeIcon,
        Risk: "Medium",
        Buy: "Buy",
        icon: faGoogle
    },
    {
        name: "Netflix",
        image: NetflixIcon,
        Risk: "High",
        Buy: "Buy",
    }

]