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

const CoursesCard = () => {
    const styles = useStyles();
    const mediaStyles = useWideCardMediaStyles();
    const textCardContentStyles = useN01TextInfoContentStyles();
    const shadowStyles = useBouncyShadowStyles();
    return (
        <Card className={cx(styles.root, shadowStyles.root)}>
            <CardMedia classes={mediaStyles} image={'https://live.staticflickr.com/130/376152628_249e3630c0_b.jpg'} />
            <CardContent className={styles.content}>
                <TextInfoContent
                    classes={textCardContentStyles}
                    overline={'World-class training'}
                    heading={'Our Courses'}
                    body={
                        'Meticulously selected courses: learn the most demanded skills on the market.'
                    }
                />

                <br/>
                <Button component={Link} to='/courses' fullWidth className={styles.cta}>
                    View Courses <ChevronRightRounded />
                </Button>
            </CardContent>
        </Card>
    );
};


export default CoursesCard;