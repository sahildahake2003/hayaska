'use client'
import SwiperLayout from '@/components/Homepage/Swiper';
import SongCard from '@/components/SongCard';
import { getSearchedData, getSongData } from '@/services/dataAPI';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SwiperSlide } from 'swiper/react';
import { BsPlayFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { playPause, setActiveSong } from '@/redux/features/playerSlice';
import Image from 'next/image';
import Link from 'next/link';


const page = ({params}) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState(params.query);
    const [searchedData, setSearchedData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getSearchedData(query);
            setSearchedData(response);
        }
        fetchData();
    }, [query]);

    const handlePlayClick = async (song) => {
        if (song?.type === "song") {
          const Data = await getSongData(song?.id);
          const songData = await Data?.[0]
          dispatch(setActiveSong({ song: songData }));
          dispatch(playPause(true));
        }
      };

  return (
    <div>
        <div className="w-11/12 m-auto mt-16">
        <div className="mt-10 text-gray-200">
            <h1 className="text-3xl font-bold">Search results for "{query.replaceAll("%20"," ") }"</h1>
            <div className="mt-10 text-gray-200">
        <h2 className="text-lg lg:text-4xl font-semibold">Songs</h2>
        {
            searchedData && searchedData?.songs?.results?.length > 0 ? (
                <div className="mt-5">
                    {
                        searchedData?.songs?.results?.map((song, index) => (
                            <div key={index}
            onClick={() => {
                handlePlayClick(song);
            }
            }
             className="flex items-center  mt-5 cursor-pointer group border-b-[1px] border-gray-400 justify-between">
                <div className="flex items-center gap-5">
              <div className=" relative">
                <img src={song?.image?.[2]?.link} alt={song?.title} width={50} height={50} className="rounded- mb-3"
                />
                <BsPlayFill
                  size={25}
                  className=" group-hover:block hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200"
                />
              </div>
              <div className="w-32 lg:w-80">
                <p className="text-sm lg:text-lg font-semibold truncate">{
                    song?.title?.replace("&#039;", "'")?.replace("&amp;", "&")
                }</p>
              </div>
              </div>
              <div className="hidden lg:block max-w-56">
                {song?.primaryArtists && (
                    <p className="text-gray-400 truncate">By: {song?.primaryArtists}</p>
                )}
                </div>
            </div>
                        ))
                    }
                    </div>
            ): (
                <div className="mt-5">
                    <h3 className="lg:text-xl text-sm font-bold">Searching...</h3>
                </div>
            )
        }
      </div>

        <div className="mt-10 text-gray-200">
        <SwiperLayout title={"Albums"}>
        { searchedData && searchedData?.albums?.results?.length > 0 &&
        searchedData?.albums?.results?.map(
            (song) =>
                (
                <SwiperSlide key={song?.id}>
                  <SongCard song={song} />
                </SwiperSlide>
              )
          )}
          </SwiperLayout>
        </div>
        <div className="mt-10 text-gray-200">
        <SwiperLayout title={"Artists"}>
        { searchedData && searchedData?.artists?.results?.length > 0 &&
        searchedData?.artists?.results?.map(
            (artist) =>
                (
                <SwiperSlide key={artist?.id}>
                  <Link href={`/artist/${artist?.id}`}>
                  <div className=' flex flex-col justify-center items-center'>
                    <Image src={artist?.image?.[2]?.link} alt={artist?.name} width={200} height={200} className="rounded-full" />
                    <p className="lg:text-base lg:w-44 w-24 text-center text-xs font-semibold mt-3 truncate">{artist?.title?.replace("&amp;","&")}</p>
                    <div>
                      {artist?.description && (
                        <p className="text-gray-400 truncate text-[8px] lg:text-xs">
                          {artist?.description}   
                    </p>
                      )}
                    </div>
                  </div>
                  </Link>
                </SwiperSlide>
              )
          )}
          </SwiperLayout>
        </div>
        <div className="mt-10 text-gray-200">
        <SwiperLayout title={"Playlists"}>
        { searchedData && searchedData?.albums?.results?.length > 0 &&
        searchedData?.playlists?.results?.map(
            (song) =>
                (
                <SwiperSlide key={song?.id}>
                  <SongCard song={song} />
                </SwiperSlide>
              )
          )}
          </SwiperLayout>
        </div>
      </div>
        </div>
    </div>
  )
}

export default page