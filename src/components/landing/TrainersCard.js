import React from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ChevronRightRounded from '@material-ui/icons/ChevronRightRounded';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useWideCardMediaStyles } from '@mui-treasury/styles/cardMedia/wide';
import { useN01TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n01';
import { useBouncyShadowStyles } from '@mui-treasury/styles/shadow/bouncy';
import {Link} from "react-router-dom";


const useStyles = makeStyles(() => ({
    root: {
        height:450,
        width: 320,
        margin: 'auto',
        boxShadow: 'none',
        borderRadius: 0,
    },
    content: {
        padding: 24,
    },
    cta: {
        marginTop: 24,
        textTransform: 'initial',
    },
}));

const TrainersCard = () => {
    const styles = useStyles();
    const mediaStyles = useWideCardMediaStyles();
    const textCardContentStyles = useN01TextInfoContentStyles();
    const shadowStyles = useBouncyShadowStyles();
    return (
        <Card className={cx(styles.root, shadowStyles.root)}>
            <CardMedia classes={mediaStyles} image={'https://www.fdmgroup.com/wp-content/uploads/german-trainers.jpg'} />
            <CardContent className={styles.content}>
                <TextInfoContent
                    classes={textCardContentStyles}
                    overline={'Our main driving force'}
                    heading={'Our team'}
                    body={
                        'No other company kickstarts careers like FDM does, and It\'s all thanks to our amazing trainers.'
                    }
                />
                <br/>
                <Button component={Link} to='/trainers' fullWidth className={styles.cta}>
                    View Trainers <ChevronRightRounded />
                </Button>
            </CardContent>
        </Card>
    );
};


export default TrainersCard;