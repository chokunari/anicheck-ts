import React, {useState, useEffect} from 'react';
import SelectField from '../SelectField/SelectField';
import AnimeCard from '../Card/AnimeCard';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        //flexGrow: 1,
    },
    animecard: {
        height: "100%",
        width: "100%",
    },
}));

//APIから受け取るjsonデータ形式
//https://github.com/Project-ShangriLa/sora-playframework-scala
interface animeApiData{
    id:number,
    title:string,
    title_short1:string,
    title_short2:string,
    title_short3:string,
    public_url:string,
    twitter_account:string,
    twitter_hash_tag:string,
    cours_id:number,
    created_at:string,
    updated_at:string,
    sex:number,
    sequel:number,
    city_code:number,
    city_name:string
}

//AnimeCard.tsxに渡すパラメタ
interface animeInfo{
    title:string,
    public_url:string,
    imgSrc:string,
    description:string
}

//backendから受け取るjsonデータ形式
interface ogpData{
    imgSrc:string,
    description:string
}

export default function Field() {
    const classes = useStyles();

    //現在の年・クールを取得
    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth()+1;
    //1~3月は1、4~6月は2、7~9月は3、10~12月は4
    const nowSeason = Math.floor((nowMonth - 1) / 3) + 1;

    const [loading, setLoading] = useState<boolean>(true);
    const [animeData, setAnimeData] = useState<animeApiData[]>([]);
    const [animeInfo, setAnimeInfo] = useState<animeInfo[]>([]);
    const [year, setYear] = useState(nowYear);
    const [season, setSeason] = useState(nowSeason);

    //年・クールが変更されたらAPIからデータをfetch。
    useEffect(() => {
        //ShangriLa Anime API URL
        const apiURL = `https://api.moemoe.tokyo/anime/v1/master/${year}/${season}`;
        //loading...の表示をするためにtrueにする。
        setLoading(true);
        fetch(apiURL, {mode: 'cors'})
            .then(response => response.json())
            .then(async (jsonobj:animeApiData[]) => {
                setAnimeData(jsonobj);
                //return jsonobj;
            });
    }, [year, season]);

    //APIからfetchされたデータが配列に格納されると、AnimeCardに渡すパラメタの配列を生成。
    useEffect(() => {
        setLoading(true);
        const control = new AbortController();
        setAnimeInfo([]);
        animeData
            .forEach(
                async elem => {
                    const ogpData = await ogpGet(elem.public_url, control.signal) ||
                    //描画中に年・クールを変更した時＝ogpGetをキャンセルした時、ogpDataはnullになるため初期化処理する。
                        {
                            imgSrc: "",
                            description: ""
                        };
                    const tmpArray:animeInfo = {
                        title: elem.title,
                        public_url: elem.public_url,
                        imgSrc: ogpData.imgSrc,
                        description: ogpData.description
                    };
                   !control.signal.aborted &&
                    //連続で年・クールが変更された場合に重複するアニメが表示されないようにするための処理。
                    setAnimeInfo(prevState =>
                        [
                            ...prevState.filter(prevAnimeInfo => prevAnimeInfo.public_url !== elem.public_url),
                            tmpArray
                        ]
                    );
                    setLoading(false);
                }
            );
        //データなしからデータなしの年・クールに遷移した場合にloadingが消えないバグの対応。
        if(!animeData.length){
            setLoading(false);
        }
        return ()=>{
            control.abort()
        }
    }, [animeData])

    const settingYear = (returnYear:number):void => {
        setYear(returnYear);
    }
    const settingSeason = (returnSeason:number):void => {
        setSeason(returnSeason);
    }

    const ogpGet  = (url:string, signal: AbortSignal): Promise<ogpData> | null => {
        const backendURL = `${process.env.REACT_APP_SERVER_URL}/getOgp`;
        const data = {reqURL: url};
        const ogpData =
            fetch(backendURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal
                })
                .then((response:Response):object => response.json())
                .catch((error) => {
                    console.error('Error:', error);
                    return null;
                }) as Promise<ogpData>;
        return ogpData;
    };


    return (
        <React.Fragment>
            <SelectField
                settingYear={settingYear}
                settingSeason={settingSeason}
                maxYear={nowYear}
                selectedYear={year}
                selectedSeason={season}
            />
            {loading ? (
                <span>loading...</span>
            ) : animeInfo.length ? (
                <Grid container className={classes.root} spacing={1}>
                    {animeInfo.map((anime, index) => (
                        <Grid key={index} item xs={12} sm={6} lg={2}>
                            <AnimeCard
                                //keyは不要だがエラーが出ないようにするために入れている。
                                //https://ja.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                                key={index}
                                imgSrc={anime.imgSrc}
                                title={anime.title}
                                public_url={anime.public_url}
                                description={anime.description}
                                className={classes.animecard}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <p>データがありません。</p>
            )
            }
        </React.Fragment>
    );
}