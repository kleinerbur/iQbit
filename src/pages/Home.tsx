import PageHeader from "../components/PageHeader";
import {
  ButtonGroup,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { useMemo, useState } from "react";
import TorrentBox from "../components/TorrentBox";
import { TorrTorrentInfo } from "../types";
import { useIsLargeScreen } from "../utils/screenSize";
import { randomTorrent } from "../data";
import "react-virtualized/styles.css";
import { useFontSizeContext } from "../components/FontSizeProvider"; // only needs to be imported once

import { FC } from "react";
import {
  List as _List,
  ListProps,
  WindowScroller as _WindowScroller,
  WindowScrollerProps,
} from "react-virtualized";
import { SpeedLimitsModeButton } from "../components/buttons/SpeedLimitsModeButton";
import { PauseAllButton, ResumeAllButton } from "../components/buttons/MutateButton";
import { SpeedStats } from "../components/SpeedStats";
import { AddTorrentDialog } from "../components/AddTorrentDialog";
import { TorrentsFilter, useLocalFilters } from "../components/TorrentsFilter";
import { IoSadOutline } from "react-icons/io5";

export const VirtualizedList = _List as unknown as FC<ListProps> & _List;
export const VirtualizedWindowScroll =
  _WindowScroller as unknown as FC<WindowScrollerProps> & _WindowScroller;

const Home = () => {
  const [rid, setRid] = useState(0);

  const [torrentsTx, setTorrentsTx] = useState<{
    [i: string]: TorrTorrentInfo;
  }>({});

  const [removedTorrs, setRemovedTorrs] = useState<string[]>([]);

  const { data: categories } = useQuery(
    "torrentsCategory",
    TorrClient.getCategories
  );

  const { isLoading } = useQuery("torrentsTxData", () => TorrClient.sync(rid), {
    refetchInterval: 1000,
    refetchOnWindowFocus: false,
    async onSuccess(data) {
      setRid(data.rid);
      setRemovedTorrs((curr) => [...curr, ...(data.torrents_removed || [])]);

      if (data.full_update) {
        // await refetch();
        setTorrentsTx(data.torrents as any);
      } else {
        if (!data.torrents) return;

        Object.entries(data.torrents).forEach(([hash, info]) => {
          Object.entries(info).forEach(([key, val]) => {
            setTorrentsTx((curr) => {
              const newObject = {
                ...curr,
                [hash]: {
                  ...curr[hash],
                  [key]: val,
                },
              };

              if ((data.torrents_removed || []).includes(hash)) {
                delete newObject[hash];
              }

              return newObject;
            });
          });
        });
      }
    },
  });

  const addModalDisclosure = useDisclosure();

  const isLarge = useIsLargeScreen();

  const filterDisclosure = useDisclosure();
  const filters = useLocalFilters()

  const Torrents = useMemo(() => {
    if (torrentsTx === undefined) {
      return [];
    }

    return Object.entries(torrentsTx)
      ?.sort((a, b) => {
        if (a[1].amount_left === 0 && b[1].amount_left > 0)
          return 1
        if (a[1].amount_left > 0 && b[1].amount_left === 0)
          return -1
        const progress_diff = b[1].progress - a[1].progress
        if (progress_diff === 0) {
          return a[1]?.name.localeCompare(b[1]?.name)
        }
        return progress_diff
      })
      ?.filter(([hash]) => !removedTorrs.includes(hash))
      ?.filter(([hash, torr]) =>
        filters.category.value !== "Show All" ? torr.category === filters.category.value : true
      )
      ?.filter(([hash, torr]) =>
        filters.status.value !== "Show All" ? torr.state === filters.status.value : true
      )
      ?.filter(([hash, torr]) => torr.name.toLowerCase().search(filters.search.value.toLowerCase()) >= 0);
  }, [torrentsTx, removedTorrs, filters]);

  const fontSizeContext = useFontSizeContext();

  return (
    <VirtualizedWindowScroll>
      {({ isScrolling, scrollTop, width, height }) => (
        <Flex flexDirection={"column"} width={"100%"} mt={isLarge ? 24 : 0}>
          <PageHeader
            title={"Transfers"}
            onAddButtonClick={addModalDisclosure.onOpen}
            buttonLabel={"Add Torrent"}
            isHomeHeader
          />

          <AddTorrentDialog disclosure={addModalDisclosure}/>

          <SpeedStats/>

          <ButtonGroup my={5} size={"lg"} width={"100%"}>
            <ResumeAllButton flexGrow={3}/>
            <PauseAllButton flexGrow={3}/>
            <SpeedLimitsModeButton flexGrow={3}/>
          </ButtonGroup>

          <TorrentsFilter disclosure={filterDisclosure}/>

          <Flex flexDirection={"column"} gap={5}>
            {isLoading &&
              Array.from(Array(10).keys()).map((key) => (
                <TorrentBox
                  key={key}
                  torrentData={randomTorrent}
                  categories={[]}
                  hash={""}
                  loading
                />
              ))}

            {Torrents.length === 0 && filters.indicator > 0 && (
              <Flex alignItems={"center"} flexDirection={"column"} gap={4}>
                <IoSadOutline size={'2em'} color={'gray'}/>
                <Heading size={'md'}>Could not find any results</Heading>
              </Flex>
            )}

            <VirtualizedList
              autoWidth
              rowCount={Torrents.length}
              rowHeight={(230 * fontSizeContext.scale) / 100}
              width={width}
              height={height}
              scrollTop={scrollTop}
              isScrolling={isScrolling}
              containerStyle={{
                paddingBottom: "300px",
                boxSizing: "content-box",
              }}
              rowRenderer={({
                key, // Unique key within array of rows
                index, // Index of row within collection
                style, // Style object to be applied to row (to position it)
              }) => (
                <div key={key}>
                  <TorrentBox
                    torrentData={Torrents[index][1]}
                    hash={Torrents[index][0]}
                    categories={Object.values(categories || {})}
                    style={{
                      ...style,
                      paddingBottom:
                        index === Torrents.length - 1 ? "30vh" : undefined,
                    }}
                  />
                </div>
              )}
            />

            {/*{Object.entries(torrentsTx)*/}
            {/*  ?.sort((a, b) => b[1]?.added_on - a[1]?.added_on)*/}
            {/*  ?.filter(([hash]) => !removedTorrs.includes(hash))*/}
            {/*  ?.map(([hash, info]) => (*/}
            {/*    <TorrentBox*/}
            {/*      key={hash}*/}
            {/*      torrentData={info}*/}
            {/*      hash={hash}*/}
            {/*      categories={Object.values(categories || {})}*/}
            {/*    />*/}
            {/*  ))}*/}
          </Flex>
        </Flex>
      )}
    </VirtualizedWindowScroll>
  );
};

export default Home;
