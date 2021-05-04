import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardButton: {
    marginTop: "auto",
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

interface Props{
  public_url:string,
  imgSrc:string,
  title:string,
  description:string,
  className:string
}

export default function AnimeCard(props:Props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = ():void => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea 
          href={props.public_url} 
          target="_blank" 
          //セキュリティ対策
          //https://web.dev/external-anchors-use-rel-noopener/
          rel="noopener noreferrer"
      >
        <CardMedia
          component="img"
          alt="NoImage"
          height="100"
          //画像パスはpublic配下からの相対パスで指定。属性はimageでもsrcでもOK。
          //backendからの返り値がnullもしくは空オブジェクトの場合はNoImage.pngを入れる。
          image={ props.imgSrc && !(props.imgSrc==="") ? (
            props.imgSrc
          ):(
            "/static/NoImage.png"
          )}
          title="ImageData"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              {`公式サイト：${props.public_url}`}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions className={classes.cardButton} disableSpacing>
        <Button 
          size="large" 
          color="primary" 
          fullWidth = {true}
          onClick={handleExpandClick}
        >
          説明文
          <ExpandMoreIcon 
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
          />
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
            { props.description && !(props.description==="") ? (
                props.description
              ):(
                "説明文なし"
              )}
        </CardContent>
      </Collapse>
    </Card>
  );
}