import React, { useState, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, LIST_TYPE, QUESTION_STATUS } from '../../constants/appStrings';
import MagiclyLoading from '../shared/MagiclyLoading';
import MagiclyError from '../shared/MagiclyError';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const datum = [
  {
    id: uuid(),
    name: 'Dropbox',
    imageUrl: '/static/images/products/product_1.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Medium Corporation',
    imageUrl: '/static/images/products/product_2.png',
    updatedAt: moment().subtract(2, 'hours')
  },
  {
    id: uuid(),
    name: 'Slack',
    imageUrl: '/static/images/products/product_3.png',
    updatedAt: moment().subtract(3, 'hours')
  },
  {
    id: uuid(),
    name: 'Lyft',
    imageUrl: '/static/images/products/product_4.png',
    updatedAt: moment().subtract(5, 'hours')
  },
  {
    id: uuid(),
    name: 'GitHub',
    imageUrl: '/static/images/products/product_5.png',
    updatedAt: moment().subtract(9, 'hours')
  }
];

const dataumm = [
  {
    id: uuid(),
    ref: 'Generator Installation',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending',
    executor: 'Henry Martinez',
  },
  {
    id: uuid(),
    ref: 'Bathroom Repair',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'delivered',
    executor: 'Jack Letts',
  },
  {
    id: uuid(),
    ref: 'Landscaping Work',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'refunded',
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
    status: 'pending',
    executor: 'Alex S.',
  },
  {
    id: uuid(),
    ref: 'Driveway Cleaning',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'delivered',
    executor: 'Henry Martinez',
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered',
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
    differenceValue: {
      color: colors.green[900],
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
  const [products] = useState(datum);
  const [orders] = useState(dataumm);
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      listType: LIST_TYPE.TODO,
      excludePast: true,
      excludeComplete: true,
      questionStatus: [
        QUESTION_STATUS.SOLVED,
        QUESTION_STATUS.UNSOLVED,
        QUESTION_STATUS.CANCELLED,
        QUESTION_STATUS.ANSWERED,
      ],
    }
  });
  const router = useRouter();

  const dataa = {
    datasets: [
      {
        data: [23, 15, 22, 34, 6],
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

  const devices = [
    {
      title: 'Maintenance',
      value: 23,
      icon: CachedIcon,
      color: '#002642'
    }, , {
      title: 'Repair',
      value: 15,
      icon: BuildIcon,
      color: '#840032'
    },
    {
      title: 'Installation',
      value: 22,
      icon: LocalLaundryServiceIcon,
      color: '#E59500'
    },
    {
      title: 'Cleaning',
      value: 34,
      icon: WavesIcon,
      color: '#0A7EF2'
    },
    {
      title: 'Other',
      value: 6,
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

  console.log('hiFRUNK: ', data);

  const getBootstrapBreakpoint = () => {
    if (process.browser && window) {
      var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      return (w < 768) ? 'xs' : ((w < 992) ? 'sm' : ((w < 1200) ? 'md' : 'lg'));
    }
    return '';
  };

  const getMockDepositoryInfo = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent style={{opacity: 0.3}}>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                DEPOSITORY BALANCE
            </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                $46,000
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
              12%
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
    let hasData = false;
    if (hasData) {
      return getMockDepositoryInfo();
    } else {
      return getMockDepositoryInfo();
    }
  };

  const getMockCreditUsage = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent style={{opacity: 0.3}}>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                CREDIT USAGE
            </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                $24,000
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar}>
                <MoneyIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
          >
            <ArrowUpwardIcon className={classes.differenceIcon2} />
            <Typography
              className={classes.differenceValue2}
              variant="body2"
            >
              16%
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

  const getCreditUsage = () => {
    let hasData = false;
    if (hasData) {
      return getMockCreditUsage();
    } else {
      return getMockCreditUsage();
    }
  };

  const getMockTodoListProgress = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent style={{opacity: 0.3}}>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                TODO LIST PROGRESS
            </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                75.5%
            </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar3}>
                <InsertChartIcon />
              </Avatar>
            </Grid>
          </Grid>
          <Box mt={3}>
            <LinearProgress
              value={75.5}
              variant="determinate"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getTodoListProgress = () => {
    let hasData = false;
    if (hasData) {
      return getMockTodoListProgress();
    } else {
      return getMockTodoListProgress();
    }
  };

  const getMockInvestmentsTotal = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardContent style={{opacity: 0.3}}>
          <Grid
            container
            justify="space-between"
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="h6"
              >
                TOTAL INVESTMENTS
            </Typography>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                $83,200
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
              46%
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
    let hasData = false;
    if (hasData) {
      return getMockInvestmentsTotal();
    } else {
      return getMockInvestmentsTotal();
    }
  };

  const getMockRecentHomework = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader title="Recent Home Work" style={{ opacity: 0.3 }} />
        <Divider />
        <PerfectScrollbar style={{ opacity: 0.3 }}>
          <Box minWidth={800}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Title
                </TableCell>
                  <TableCell>
                    Cost (USD)
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
                    Executor
                </TableCell>
                  <TableCell>
                    Status
                </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    hover
                    key={order.id}
                  >
                    <TableCell>
                      {order.ref}
                    </TableCell>
                    <TableCell>
                      {order.amount}
                    </TableCell>
                    <TableCell>
                      {moment(order.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      {order.executor}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color="primary"
                        label={order.status}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
          style={{opacity: 0.3}}
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

  const getRecentHomework = () => {
    let hasData = false;
    if (hasData) {
      return getMockRecentHomework();
    } else {
      return getMockRecentHomework();
    }
  };

  const getMockHomeworkByType = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader title="Home Health" style={{ opacity: 0.3 }} />
        <Divider />
        <CardContent style={{opacity: 0.3}}>
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
            {devices.map(({
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

  const getHomeworkByType = () => {
    let hasData = false;
    if (hasData) {
      return getMockHomeworkByType();
    } else {
      return getMockHomeworkByType();
    }
  };

  const getMockRecentRecommendations = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          subtitle={`${products.length} in total`}
          title="Recent Recommendations"
          style={{ opacity: 0.3 }}
        />
        <Divider />
        <List style={{opacity: 0.3}}>
          {products.map((product, i) => (
            <ListItem
              divider={i < products.length - 1}
              key={product.id}
            >
              <ListItemIcon>{<StarIcon />}</ListItemIcon>
              <ListItemText
                primary={product.name}
                secondary={`Updated ${product.updatedAt.fromNow()}`}
              />
              <IconButton
                edge="end"
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
          style={{opacity: 0.3}}
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

  const getRecentRecommendations = () => {
    let hasData = false;
    if (hasData) {
      return getMockRecentRecommendations();
    } else {
      return getMockRecentRecommendations();
    }
  };

  const getMockRecentShoppingLists = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          subtitle={`${products.length} in total`}
          title="Recent Shopping Lists"
          style={{ opacity: 0.3 }}
        />
        <Divider />
        <List style={{opacity: 0.3}}>
          {products.map((product, i) => (
            <ListItem
              divider={i < products.length - 1}
              key={product.id}
            >
              <ListItemIcon>{<ShoppingCartIcon />}</ListItemIcon>
              <ListItemText
                primary={product.name}
                secondary={`Updated ${product.updatedAt.fromNow()}`}
              />
              <IconButton
                edge="end"
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
          style={{opacity: 0.3}}
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
    if (hasData) {
      return getMockRecentShoppingLists();
    } else {
      return getMockRecentShoppingLists();
    }
  };

  const getMockRecentDocuments = () => {
    return (
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader
          subtitle={`${products.length} in total`}
          title="Recent Documents"
          style={{ opacity: 0.3 }}
        />
        <Divider />
        <List style={{ opacity: 0.3 }}>
          {products.map((product, i) => (
            <ListItem
              divider={i < products.length - 1}
              key={product.id}
            >
              <ListItemIcon>{<DescriptionIcon />}</ListItemIcon>
              <ListItemText
                primary={product.name}
                secondary={`Updated ${product.updatedAt.fromNow()}`}
              />
              <IconButton
                edge="end"
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
          style={{opacity: 0.3}}
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

  const getRecentDocuments = () => {
    let hasData = false;
    if (hasData) {
      return getMockRecentDocuments();
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
        spacing={3}
      >
        <Grid
          item
          lg={3}
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
          xl={3}
          xs={12}
        >
          {getCreditUsage()}
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          {getInvestmentsTotal()}
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          {getDepositoryInfo()}
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          {getHomeworkByType()}
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          {getRecentHomework()}
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          {getRecentDocuments()}
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          {getRecentRecommendations()}
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
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