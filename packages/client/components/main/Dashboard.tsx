import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, QUESTION_STATUS, DOC_TYPE } from '../../constants/appStrings';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import MagiclyButton from '../shared/MagiclyButton';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme, useTheme, withStyles } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AttachMoney from '@material-ui/icons/AttachMoney';
import StarIcon from '@material-ui/icons/Star';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import MoneyIcon from '@material-ui/icons/Money';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import HomeIcon from '@material-ui/icons/Home';
import BuildIcon from '@material-ui/icons/Build';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';
import DescriptionIcon from '@material-ui/icons/Description';
import CachedIcon from '@material-ui/icons/Cached';
import WavesIcon from '@material-ui/icons/Waves';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Container,
  CardHeader,
  Grid,
  Divider,
  Typography,
  IconButton,
  List,
  LinearProgress,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { TrainRounded } from '@material-ui/icons';

const mockShoppingLists = [
  {
    id: uuid(),
    name: 'Superbowl Sunday',
    imageUrl: '/static/images/products/product_1.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Liz Birthday',
    imageUrl: '/static/images/products/product_2.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Holiday Party',
    imageUrl: '/static/images/products/product_3.png',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Taco Thursday',
    imageUrl: '/static/images/products/product_4.png',
    updatedAt: moment().subtract(5, 'hours')
  },
  {
    id: uuid(),
    name: 'Wine Wednesday',
    imageUrl: '/static/images/products/product_5.png',
    updatedAt: moment().subtract(9, 'hours')
  }
];

const mockDocuments = [
  {
    id: uuid(),
    name: 'Electrolux Washer',
    imageUrl: '/static/images/products/product_1.png',
    type: 'WARRANTY',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Dyson Hand Vacuum',
    imageUrl: '/static/images/products/product_2.png',
    type: 'MANUAL',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Beach House Deed',
    imageUrl: '/static/images/products/product_3.png',
    type: 'PROPERTY',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Le Cordon Bleu Summer',
    imageUrl: '/static/images/products/product_4.png',
    type: 'CERTIFICATE',
    updatedAt: moment().subtract(5, 'hours')
  },
  {
    id: uuid(),
    name: 'Family Tree',
    imageUrl: '/static/images/products/product_5.png',
    type: 'FAMILY',
    updatedAt: moment().subtract(9, 'hours')
  }
];

const mockRecommendations = [
  {
    id: uuid(),
    name: 'Game of Thrones',
    imageUrl: '/static/images/products/product_1.png',
    type: 'TV',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'The French Laundry',
    imageUrl: '/static/images/products/product_2.png',
    type: 'RESTAURANT',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Dalgona coffee',
    imageUrl: '/static/images/products/product_3.png',
    type: 'FOOD',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Flashing Lights - El Fin De Semana',
    imageUrl: '/static/images/products/product_4.png',
    type: 'MUSIC',
    updatedAt: moment().subtract(5, 'hours')
  },
  {
    id: uuid(),
    name: 'Per Se',
    imageUrl: '/static/images/products/product_5.png',
    type: 'RESTAURANT',
    updatedAt: moment().subtract(9, 'hours')
  }
];

const mockHomeworks = [
  {
    id: uuid(),
    ref: 'Generator Installation',
    amount: 330.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'past',
    executor: 'Henry Martinez',
  },
  {
    id: uuid(),
    ref: 'Bathroom Repair',
    amount: 315.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'past',
    executor: 'Jack Letts',
  },
  {
    id: uuid(),
    ref: 'Landscaping Work',
    amount: 510.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'past',
    executor: 'Tiago Fresco',
  },
  {
    id: uuid(),
    ref: 'Pool Cleaning',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'past',
    executor: 'Alex S.',
  },
  {
    id: uuid(),
    ref: 'Driveway Cleaning',
    amount: 132.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'past',
    executor: 'Henry Martinez',
  },
  {
    id: uuid(),
    ref: 'Hurricane Windows',
    amount: 1416.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1615785950211,
    status: 'upcoming',
    executor: '',
  }
];

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const QUERY = gql`
  query GetMe (
    $cursor: String,
    $limit: Int,
    $excludePast: Boolean,
    $excludeComplete: Boolean,
    $listType: ListType!,
    $questionStatus: [QuestionStatus],
    $docTypes: [DocType],
  ) {
    questions(
      questionStatus: $questionStatus,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        body
        type
        urgent
        status
      }
      pageInfo {
        endCursor
      }
    }
    me {
      id
      firstName
      lastName
      email
    }
    homeworks(
      cursor: $cursor,
      limit: $limit,
      excludePast: $excludePast,
    ) {
      edges {
        id
        title
        type
        status
        executionDate
        cost
        executor
      }
    }
    listItems(
      listType: $listType,
      excludeComplete: $excludeComplete,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        name
        type
        executionDate
        complete
        notes
        list {
          id
          name
          type
        }
      }
      pageInfo {
        endCursor
      }
    }
    recentRecommendations(
      listType: $listType,
      excludeComplete: $excludeComplete,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        name
        type
        executionDate
        complete
        notes
        list {
          id
          name
          type
        }
      }
      pageInfo {
        endCursor
      }
    }
    shoppingLists(
      cursor: $cursor,
      limit: $limit,
    ) {
      edges {
        id
        name
        type
        updatedAt
        listItems {
          id
          name
          type
          notes
        }
      }
      pageInfo {
        endCursor
      }
    }
    documents(
      docTypes: $docTypes,
      cursor: $cursor,
      limit: $limit
    ) {
      edges {
        id
        name
        type
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
    hoverRow: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    addHWBtn: {
      marginTop: '120px',
      [theme.breakpoints.down('md')]: {
        marginTop: '50px',
      },
    },
    image: {
      height: 48,
      width: 48
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    centerText: {
      textAlign: 'center',
    },
    notes: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    timestamp: {
      marginLeft: '30px',
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    checked: {},
    radio: {
      '&$checked': {
        color: '#840032'
      }
    },
    avatar: {
      backgroundColor: colors.red[600],
      height: 56,
      width: 56
    },
    differenceIcon: {
      color: colors.green[900]
    },
    differenceIconMock: {
      color: '#f3f6f8'
    },
    differenceValue: {
      color: colors.green[900],
      marginRight: theme.spacing(1)
    },
    differenceValueMock: {
      color: '#f3f6f8',
      marginRight: theme.spacing(1)
    },
    avatar2: {
      backgroundColor: colors.green[600],
      height: 56,
      width: 56
    },
    differenceIcon2: {
      color: colors.red[900]
    },
    differenceValue2: {
      color: colors.red[900],
      marginRight: theme.spacing(1)
    },
    avatar3: {
      backgroundColor: colors.orange[600],
      height: 56,
      width: 56
    },
    avatar4: {
      backgroundColor: colors.indigo[600],
      height: 56,
      width: 56
    }
  }),
);

const Dashboard = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mockSLists] = useState(mockShoppingLists);
  const [mockDocs] = useState(mockDocuments);
  const [mockRecs] = useState(mockRecommendations);
  const [mockHWs] = useState(mockHomeworks);
  const [creditUsage, setCreditUsage] = useState(0);
  const [investmentsTotalString, setInvestmentsTotalString] = useState('0');
  const [depositoriesTotalString, setDepositoriesTotalString] = useState('0');
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      limit: 5,
      listType: LIST_TYPE.TODO,
      excludePast: false,
      excludeComplete: false,
      docTypes: Object.keys(DOC_TYPE),
      questionStatus: [
        QUESTION_STATUS.SOLVED,
        QUESTION_STATUS.UNSOLVED,
        QUESTION_STATUS.CANCELLED,
        QUESTION_STATUS.ANSWERED,
      ],
    }
  });
  const router = useRouter();

  const fetchHasPlaidAccounts = async () => {
    const response = await fetch('/finance/hasPlaidAccounts', { method: 'GET' });
    const responseJSON = await response.json();
    return responseJSON.hasPlaidAccounts;
  };

  const fetchTransactions = async (lastXDays: any) => {
    const response = await fetch('/finance/transactionsList?' + `lastXDays=${lastXDays}`);
    if (response.redirected) {
      return [];
    }
    const responseJSON = await response.json();
    return responseJSON;
  };

  useEffect(() => {
    async function getTxns() {
      const hasPlaidAccountsVerdict = await fetchHasPlaidAccounts();
      if (hasPlaidAccountsVerdict) {
        // TODO: what should this be?
        let lastXDays = 90;
        const transactions = await fetchTransactions(lastXDays);
        if (transactions && transactions.transactions && transactions.transactions[0].transactions.length > 0) {

          let creditUsage = 0;
          let creditLimit = 0;
          let investmentTotal = 0;
          let depositoryTotal = 0;

          for (let i = 0; i < transactions.transactions[0].transactions.length; i++) {
            let account = transactions.transactions[0].accounts[i];
            if (account && account.type) {

              if (account.type === 'credit') {
                if (account.balances.available) {
                  creditUsage += account.balances.available;
                } else {
                  creditUsage += account.balances.current;
                }
                creditLimit += account.balances.limit;
              }

              if (account.type === 'investment') {
                if (account.balances.available) {
                  investmentTotal += account.balances.available;
                } else {
                  investmentTotal += account.balances.current;
                }
              }

              if (account.type === 'depository') {
                if (account.balances.available) {
                  depositoryTotal += account.balances.available;
                } else {
                  depositoryTotal += account.balances.current;
                }
              }

            }

          }
          let formattedCreditUsage = parseFloat(((creditUsage / creditLimit) * 100).toFixed(2));
          setCreditUsage(formattedCreditUsage);
          setInvestmentsTotalString(investmentTotal.toFixed(2).replace(/(.)(?=(\d{3})+$)/g,'$1,'));
          setDepositoriesTotalString(depositoryTotal.toFixed(2).replace(/(.)(?=(\d{3})+$)/g, '$1,'));
        }
      }
    }
    getTxns();
  }, []);

  const addCommas = (nStr) => {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  const dataa = {
    datasets: [
      {
        data: [1, 1, 1, 1, 1],
        backgroundColor: [
          '#002642',
          '#840032',
          '#E59500',
          '#0A7EF2',
          '#E5DADA'
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Maintenance', 'Repair', 'Installation', 'Cleaning', 'Other'],
  };


  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const mockHomeworkByType = [
    {
      title: 'Maintenance',
      value: 0,
      icon: CachedIcon,
      color: '#002642'
    }, , {
      title: 'Repair',
      value: 0,
      icon: BuildIcon,
      color: '#840032'
    },
    {
      title: 'Installation',
      value: 0,
      icon: LocalLaundryServiceIcon,
      color: '#E59500'
    },
    {
      title: 'Cleaning',
      value: 0,
      icon: WavesIcon,
      color: '#0A7EF2'
    },
    {
      title: 'Other',
      value: 0,
      icon:  HomeIcon,
      color: '#E5DADA'
    }
  ];

  if (loading) return <MagiclyLoading open={true} hideLayout={true} />;
  if (error) return <MagiclyError message={error.message} hideLayout={true} />;
  if (data && data.createQuestion && data.createQuestion.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'productivity/help';
    } else {
      router.push('/productivity/help', undefined);
    }
  }

  const getQueryStringValue = (key) => {
    return decodeURIComponent(
      window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1")
    );
  };

  const isNewUser = getQueryStringValue("new") === 'true';

  const getBootstrapBreakpoint = () => {
    if (process.browser && window) {
      var w = getWindowWidth();
      return (w < 768) ? 'xs' : ((w < 992) ? 'sm' : ((w < 1200) ? 'md' : 'lg'));
    }
    return '';
  };

  const getWindowWidth = () => {
    if (process.browser && window) {
      var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      return w;
    }
    return '';
  };

  const routePage = (pageName: string) => {
    router.push('/' + pageName, undefined)
  };

  const getMockDepositoryInfo = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                CHECKING/SAVINGS
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                $0
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar2}>
                <AttachMoney />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <ArrowUpwardIcon className={classes.differenceIconMock} />
            <Typography
              className={classes.differenceValueMock}
              variant="body2"
            >
              0%
          </Typography>
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Since last month
          </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getRealDepositoryInfo = () => {
    return (
      <Card
        className={clsx(classes.root)}
        onClick={routePage.bind(this, `finance/dashboard`)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                CHECKING/SAVINGS
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                {`$${addCommas(depositoriesTotalString)}`}
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar2}>
                <AttachMoney />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <ArrowUpwardIcon className={classes.differenceIcon} />
            <Typography
              className={classes.differenceValue}
              variant="body2"
            >
              0%
          </Typography>
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Since last month
          </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getDepositoryInfo = () => {
    if (parseInt(depositoriesTotalString) > 0 && isNewUser !== true) {
      return getRealDepositoryInfo();
    } else {
      return getMockDepositoryInfo();
    }
  };

  const getMockCreditUsage = () => {

    const CreditUsageLinearProgress = withStyles((theme) => ({
      colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: '#f3f6f8',
      },
    }))(LinearProgress);

    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                CREDIT USAGE
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                0%
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar}>
                <MoneyIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box mt={3}>
            <CreditUsageLinearProgress
              value={0}
              variant="determinate"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getRealCreditUsage = () => {
    let green = '#43a047';
    let red = '#e53935';
    let color = '';
    let verbiage = 'Great! Your usage is below the recommended 30%';

    if (creditUsage < 30) {
      color = green;
    } else {
      verbiage = 'Uh-oh! Your usage is at or above the recommdended 30%';
      color = red;
    }

    const CreditUsageLinearProgress = withStyles((theme) => ({
      colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: color,
      },
    }))(LinearProgress);

    return (
      <Card
        className={clsx(classes.root)}
        onClick={routePage.bind(this, `finance/dashboard`)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                CREDIT USAGE
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                {`${creditUsage}%`}
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar}>
                <MoneyIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box mt={3}>
            <CreditUsageLinearProgress
              value={creditUsage}
              variant="determinate"
            />
          </Box>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="textSecondary"
              variant="caption"
            >
              {verbiage}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getCreditUsage = () => {
    if (creditUsage > 0 && isNewUser !== true) {
      return getRealCreditUsage();
    } else {
      return getMockCreditUsage();
    }
  };

  const getMockTodoListProgress = () => {
    const TodoListLinearProgress = withStyles((theme) => ({
      colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: '#f3f6f8',
      },
    }))(LinearProgress);

    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                TODO PROGRESS
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                0%
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar3}>
                <InsertChartIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box mt={3}>
            <TodoListLinearProgress
              value={0}
              variant="determinate"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getRealTodoListProgress = (listItems) => {
    let complete = 0;
    let incomplete = 0;
    let total = 0;
    let progress = 0;
    let green = '#43a047';
    let red = '#e53935';
    let color = '';
    let verbiage = 'Great! No todo items to complete';

    for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].complete === true) {
        complete += 1;
      } else {
        incomplete += 1;
      }
    }

    total = complete + incomplete;

    if (total === 0) {
      progress = 0;
    } else if (incomplete === 0 && complete > 0) {
      progress = 100;
    } else {
      progress = parseFloat(((complete / total) * 100).toFixed(2));
    }

    if (progress < 50) {
      color = red;
    } else {
      color = green;
    }

    if (incomplete > 1) {
      verbiage = `Complete ${incomplete} todo items to get to 100%`;
    } else if (incomplete === 1) {
      verbiage = `Complete ${incomplete} todo item to get to 100%`;
    }

    const TodoListLinearProgress = withStyles((theme) => ({
      colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      },
      bar: {
        borderRadius: 5,
        backgroundColor: color,
      },
    }))(LinearProgress);

    return (
      <Card
        className={clsx(classes.root)}
        onClick={routePage.bind(this, `productivity/lists`)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                TODO PROGRESS
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                {`${progress}%`}
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar3}>
                <InsertChartIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box mt={3}>
            <TodoListLinearProgress
              value={progress}
              variant="determinate"
            />
          </Box>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <Typography
              color="textSecondary"
              variant="caption"
            >
              {verbiage}
          </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getTodoListProgress = () => {
    let hasData = data && data.listItems && data.listItems.edges && data.listItems.edges.length > 0;
    if (hasData && isNewUser !== true) {
      return getRealTodoListProgress(data.listItems.edges);
    } else {
      return getMockTodoListProgress();
    }
  };

  const getMockInvestmentsTotal = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                INVESTMENTS
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                $0
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar4}>
                <AttachMoney />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <ArrowUpwardIcon className={classes.differenceIconMock} />
            <Typography
              className={classes.differenceValueMock}
              variant="body2"
            >
              0%
          </Typography>
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Since last month
          </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getRealInvestmentsTotal = () => {
    return (
      <Card
        className={clsx(classes.root)}
        onClick={routePage.bind(this, `finance/dashboard`)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textPrimary"
                gutterBottom
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'body2' : 'h6'}
              >
                INVESTMENTS
            </Typography>
              <Typography
                color="textPrimary"
                variant={getWindowWidth() < 1466 && getWindowWidth() > 1280 ? 'h6' : 'h4'}
              >
                {`$${addCommas(investmentsTotalString)}`}
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar4}>
                <AttachMoney />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <ArrowUpwardIcon className={classes.differenceIcon} />
            <Typography
              className={classes.differenceValue}
              variant="body2"
            >
              0%
          </Typography>
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Since last month
          </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getInvestmentsTotal = () => {
    if (parseInt(investmentsTotalString) > 0 && isNewUser !== true) {
      return getRealInvestmentsTotal();
    } else {
      return getMockInvestmentsTotal();
    }
  };

  const getMockHomework = () => {
    return (
      <Card className={clsx(classes.root)}>
        <CardHeader title="Home Work" />
        <Divider />
          <CardContent>
          <Typography gutterBottom variant="h5" component="h2" style={{ color: 'rgba(0, 0, 0, 0.54)', marginBottom: '30px', marginTop: '10px'}}>
              Any home work you save, such as maintenance, repairs, installations, cleaning, and other will be displayed here.
          </Typography>
          <Typography gutterBottom variant="h6" component="h2" style={{ color: 'rgba(0, 0, 0, 0.54)', marginBottom: '10px' }}>
              Some inspirations to get you started:
          </Typography>
          <Typography gutterBottom variant="body1" component="p" style={{ color: 'rgba(0, 0, 0, 0.54)'}}>
              - Pool cleaning
          </Typography>
          <Typography gutterBottom variant="body1" component="p" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
              - Dishwasher installation
          </Typography>
          <Typography gutterBottom variant="body1" component="p" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
              - Generator maintenance
          </Typography>
          </CardContent>
        <CardActions className={classes.addHWBtn}>
          <MagiclyButton
            btnLabel={'Add Home Work'}
            onClick={routePage.bind(this, `home/work/add`)}
          />
        </CardActions>
      </Card>
    );
  };

  const getRealIndividualHomework = (recentHomework) => {
    const executionDate = new Date(recentHomework.executionDate);
    const month = executionDate.getUTCMonth() + 1; //months from 1-12
    const day = executionDate.getUTCDate();
    const year = executionDate.getUTCFullYear();
    // TODO: this is hacky and you know it. fix it and dont be lazy
    const correctDate = year + "/" + month + "/" + day;

    return (
      <TableRow
        hover
        key={recentHomework.id}
        onClick={routePage.bind(this, `home/work/view/${recentHomework.id}`)}
      >
        <TableCell>
          {
            recentHomework.title.length > 21 ?
              recentHomework.title.substring(0, 21) + '...' :
              recentHomework.title
          }
        </TableCell>
        <TableCell>
          {momentTimezone(correctDate).tz('America/New_York').format('MM/DD/YYYY')}
        </TableCell>
        <TableCell>
          {recentHomework.cost}
        </TableCell>
        <TableCell>
          <Chip
            color="primary"
            label={recentHomework.type}
            size="small"
          />
        </TableCell>
      </TableRow>
    );
  };

  const getRealHomework = (recentHomeworks) => {

    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader title="Home Work" />
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={600}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Title
                </TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip
                      enterDelay={300}
                      title="Sort"
                    >
                      <TableSortLabel
                        active
                        direction="desc"
                      >
                        Date
                    </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    Cost (USD)
                </TableCell>
                  <TableCell>
                    Type
                </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentHomeworks.map((recentHomework) => (
                  getRealIndividualHomework(recentHomework)
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}

        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
            onClick={routePage.bind(this, `home/work`)}
          >
            View all
        </Button>
        </Box>
      </Card>
    );
  };

  const getHomework = () => {
    if (data.homeworks && data.homeworks.edges && data.homeworks.edges.length > 0 && isNewUser !== true) {
      return getRealHomework(data.homeworks.edges);
    } else {
      return getMockHomework();
    }
  };

  const getMockHomeworkByType = () => {
    let bootstrapBreakpoint = getBootstrapBreakpoint();
    if (bootstrapBreakpoint === 'xs') {
      return (
        <Card
          className={clsx(classes.root)}
        >
          <CardHeader title="Home Work Breakdown" />
          <Divider />
          <CardContent>
            <Box
              height={300}
              position="relative"
            >
              <Doughnut
                data={dataa}
                options={options}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              mt={2}
            >
              <Grid container>
                {mockHomeworkByType.map(({
                  color,
                  icon: Icon,
                  title,
                  value
                }) => (
                  <Grid item sm={6} xs={6} lg={4}>
                    <Box
                      key={title}
                      p={1}
                      textAlign="center"
                    >
                      <Icon color="action" />
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {title}
                      </Typography>
                      <Typography
                        style={{ color }}
                        variant="h4"
                      >
                        {value}
                    %
                  </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader title="Home Work Breakdown" />
        <Divider />
        <CardContent>
          <Box
            height={300}
            position="relative"
          >
            <Doughnut
              data={dataa}
              options={options}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            mt={2}
          >
            {mockHomeworkByType.map(({
              color,
              icon: Icon,
              title,
              value
            }) => (
              <Box
                key={title}
                p={1}
                textAlign="center"
              >
                <Icon color="action" />
                <Typography
                  color="textPrimary"
                  variant="body1"
                >
                  {title}
                </Typography>
                <Typography
                  style={{ color }}
                  variant="h4"
                >
                  {value}
                %
              </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getRealHomeworkByType = (homeworks) => {
    let past = 0;
    let upcoming = 0;
    let total = 0;
    let progress = 0;

    let maintenance = 0;
    let repair = 0;
    let installation = 0;
    let cleaning = 0;
    let other = 0;
    let realHomeworkData = [];

    for (let i = 0; i < homeworks.length; i++) {
      total += 1;

      if (homeworks[i].type === 'MAINTENANCE') {
        maintenance += 1;
      } else if (homeworks[i].type === 'REPAIR') {
        repair += 1;
      } else if (homeworks[i].type === 'INSTALLATION') {
        installation += 1;
      } else if (homeworks[i].type === 'CLEANING') {
        cleaning += 1;
      } else if (homeworks[i].type === 'OTHER') {
        other += 1;
      }
    }

    realHomeworkData = [maintenance, repair, installation, cleaning, other]

    const homeworkData = {
      datasets: [
        {
          data: realHomeworkData,
          backgroundColor: [
            '#002642',
            '#840032',
            '#E59500',
            '#0A7EF2',
            '#E5DADA'
          ],
          borderWidth: 8,
          borderColor: colors.common.white,
          hoverBorderColor: colors.common.white
        }
      ],
      labels: ['Maintenance', 'Repair', 'Installation', 'Cleaning', 'Other'],
    };

    const homeworkTypes = [
      {
        title: 'Maintenance',
        value: parseFloat(((maintenance / total) * 100).toFixed(2)),
        icon: CachedIcon,
        color: '#002642'
      }, , {
        title: 'Repair',
        value: parseFloat(((repair / total) * 100).toFixed(2)),
        icon: BuildIcon,
        color: '#840032'
      },
      {
        title: 'Installation',
        value: parseFloat(((installation / total) * 100).toFixed(2)),
        icon: LocalLaundryServiceIcon,
        color: '#E59500'
      },
      {
        title: 'Cleaning',
        value: parseFloat(((cleaning / total) * 100).toFixed(2)),
        icon: WavesIcon,
        color: '#0A7EF2'
      },
      {
        title: 'Other',
        value: parseFloat(((other / total) * 100).toFixed(2)),
        icon: HomeIcon,
        color: '#E5DADA'
      }
    ];

    let bootstrapBreakpoint = getBootstrapBreakpoint();
    if (bootstrapBreakpoint === 'xs') {
      return (
        <Card
          className={clsx(classes.root)}
        >
          <CardHeader title="Home Work Breakdown" />
          <Divider />
          <CardContent>
            <Box
              height={300}
              position="relative"
            >
              <Doughnut
                data={homeworkData}
                options={options}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              mt={2}
            >
              <Grid container>
                {homeworkTypes.map(({
                  color,
                  icon: Icon,
                  title,
                  value
                }) => (
                  <Grid item sm={6} xs={6} lg={4}>
                    <Box
                      key={title}
                      p={1}
                      textAlign="center"
                    >
                      <Icon color="action" />
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {title}
                      </Typography>
                      <Typography
                        style={{ color }}
                        variant="h6"
                      >
                        {value}
                  %
                </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader title="Home Work Breakdown" />
        <Divider />
        <CardContent>
          <Box
            height={300}
            position="relative"
          >
            <Doughnut
              data={homeworkData}
              options={options}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            mt={2}
          >
            {homeworkTypes.map(({
              color,
              icon: Icon,
              title,
              value
            }) => (
                <Box
                  key={title}
                  p={1}
                  textAlign="center"
                >
                  <Icon color="action" />
                  <Typography
                    color="textPrimary"
                    variant="body1"
                  >
                    {title}
                  </Typography>
                  <Typography
                    style={{ color }}
                    variant="h6"
                  >
                    {value}
                %
              </Typography>
                </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getHomeworkByType = () => {
    let hasData = data && data.homeworks && data.homeworks.edges && data.homeworks.edges.length > 0;
    if (hasData && isNewUser !== true) {
      return getRealHomeworkByType(data.homeworks.edges);
    } else {
      return getMockHomeworkByType();
    }
  };

  const getMockRecentRecommendations = () => {
    return (
      <Card className={clsx(classes.root)}>
        <CardHeader title="Recommendations" />
        <Divider />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" style={{ color: 'rgba(0, 0, 0, 0.54)', marginBottom: '30px', marginTop: '10px' }}>
            Any recommendations you save, such as restaurants, TV shows, movies, and more will be displayed here.
          </Typography>
        </CardContent>
        <CardActions style={{ marginTop: '50px', marginBottom: '20px'  }}>
          <MagiclyButton
            btnLabel={'Add Recommendation'}
            onClick={routePage.bind(this, `productivity/recommendations/add`)}
          />
        </CardActions>
      </Card>
    );
  };

  const getRealRecentRecommendations = (recommendations) => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          subtitle={`${recommendations.length} in total`}
          title="Recent Recommendations"

        />
        <Divider />
        <List >
          {recommendations.map((recommendation, i) => (
            <ListItem
              divider={i < recommendations.length - 1}
              key={recommendation.id}
              onClick={routePage.bind(this, `productivity/recommendations/view/${recommendation.id}`)}
              className={classes.hoverRow}
            >
              <ListItemIcon>{<StarIcon />}</ListItemIcon>
              <ListItemText
                primary={recommendation.name}
                secondary={`Type: ${recommendation.type}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}

        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
            onClick={routePage.bind(this, `productivity/recommendations`)}
          >
            View all
          </Button>
        </Box>
      </Card>
    );
  };

  const getRecentRecommendations = () => {
    let hasData = false;
    if (data.recentRecommendations && data.recentRecommendations.edges && data.recentRecommendations.edges.length > 0 && isNewUser !== true) {
      return getRealRecentRecommendations(data.recentRecommendations.edges);
    } else {
      return getMockRecentRecommendations();
    }
  };

  const getMockRecentShoppingLists = () => {
    return (
      <Card className={clsx(classes.root)}>
        <CardHeader title="Shopping Lists" />
        <Divider />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" style={{ color: 'rgba(0, 0, 0, 0.54)', marginBottom: '30px', marginTop: '10px' }}>
            Any shopping lists you save, such as grocery lists, birthday party lists, and more will be displayed here.
          </Typography>
        </CardContent>
        <CardActions style={{ marginTop: '50px', marginBottom: '20px' }}>
          <MagiclyButton
            btnLabel={'Add Shopping List'}
            onClick={routePage.bind(this, `productivity/shopping/add`)}
          />
        </CardActions>
      </Card>
    );
  };

  const getRealRecentShoppingLists = (shoppingLists) => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          subtitle={`${shoppingLists.length} in total`}
          title="Recent Shopping Lists"

        />
        <Divider />
        <List >
          {shoppingLists.map((shoppingList, i) => (
            <ListItem
              divider={i < shoppingLists.length - 1}
              key={shoppingList.id}
              onClick={routePage.bind(this, `productivity/shopping/view/${shoppingList.id}`)}
              className={classes.hoverRow}
            >
              <ListItemIcon>{<ShoppingCartIcon />}</ListItemIcon>
              <ListItemText
                primary={shoppingList.name}
                secondary={`Updated ${moment(shoppingList.updatedAt).fromNow()}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}

        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </Box>
      </Card>
    );
  };

  const getRecentShoppingLists = () => {
    let hasData = false;
    if (data.shoppingLists && data.shoppingLists.edges && data.shoppingLists.edges.length > 0 && isNewUser !== true) {
      return getRealRecentShoppingLists(data.shoppingLists.edges);
    } else {
      return getMockRecentShoppingLists();
    }
  };

  const getMockRecentDocuments = () => {
    return (
      <Card className={clsx(classes.root)}>
        <CardHeader title="Documents" />
        <Divider />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" style={{ color: 'rgba(0, 0, 0, 0.54)', marginBottom: '30px', marginTop: '10px' }}>
            Any documents you save, such as appliance manuals, warranties, receipts, and more will be displayed here.
          </Typography>
        </CardContent>
        <CardActions style={{ marginTop: '50px', marginBottom: '20px' }}>
          <MagiclyButton
            btnLabel={'Add Document'}
            onClick={routePage.bind(this, `home/documents/add`)}
          />
        </CardActions>
      </Card>
    );
  };

  const getRealRecentDocuments = (documents) => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          subtitle={`${documents.length} in total`}
          title="Recent Documents"

        />
        <Divider />
        <List >
          {documents.map((document, i) => (
            <ListItem
              divider={i < documents.length - 1}
              key={document.id}
              onClick={routePage.bind(this, `home/documents/view/${document.id}`)}
              className={classes.hoverRow}
            >
              <ListItemIcon>{<DescriptionIcon />}</ListItemIcon>
              <ListItemText
                primary={document.name}
                secondary={`Type: ${document.type}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}

        >
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
            onClick={routePage.bind(this, `home/documents`)}
          >
            View all
          </Button>
        </Box>
      </Card>
    );
  };

  const getRecentDocuments = () => {
    if (data.documents && data.documents.edges && data.documents.edges.length > 0 && isNewUser !== true) {
      return getRealRecentDocuments(data.documents.edges);
    } else {
      return getMockRecentDocuments();
    }
  };

  let bootstrapBreakpoint = getBootstrapBreakpoint();
  let style = {};

  if (bootstrapBreakpoint === 'xs') {
    style = { maxWidth: '350px' };
  }

  return (
    <Container maxWidth={false} style={style}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          lg={3}
          md={6}
          sm={6}
          xl={3}
          xs={12}
        >
          {getTodoListProgress()}
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          md={6}
          xl={3}
          xs={12}
        >
          {getCreditUsage()}
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          md={6}
          xl={3}
          xs={12}
        >
          {getInvestmentsTotal()}
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          md={6}
          xl={3}
          xs={12}
        >
          {getDepositoryInfo()}
        </Grid>
        <Grid
          item
          lg={5}
          md={6}
          xl={3}
          xs={12}
        >
          {getHomeworkByType()}
        </Grid>
        <Grid
          item
          lg={7}
          md={6}
          xl={9}
          xs={12}
        >
          {getHomework()}
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          xl={3}
          xs={12}
        >
          {getRecentDocuments()}
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          xl={3}
          xs={12}
        >
          {getRecentRecommendations()}
        </Grid>
        <Grid
          item
          lg={4}
          md={4}
          xl={3}
          xs={12}
        >
          {getRecentShoppingLists()}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;