import { Box, Stat, StatNumber, StatHelpText, StatProps, Flex, Spacer, Tooltip } from '@chakra-ui/react'
import { IoDownload, IoCloudUpload } from 'react-icons/io5'
import { IconContext } from "react-icons"
import { TorrClient } from '../utils/TorrClient'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { formatBytes } from '../utils/formatBytes'

interface SpeedStatsProps extends StatProps {
  refetchInterval?: number
}

export function SpeedStats(props: SpeedStatsProps) {
  const [downSpeed, setDownSpeed] = useState<string>('0')
  const [upSpeed, setUpSpeed] = useState<string>('0')
  const [downLimit, setDownLimit] = useState<string>('Unlimited')
  const [upLimit, setUpLimit] = useState<string>('Unlimited')
  const [isSpeedLimited, setSpeedLimited] = useState<boolean>(false)
  
  useQuery({
    queryKey: 'speedLimitsMode',
    queryFn: TorrClient.getSpeedLimitsMode,
    onSuccess: (data) => {
      setSpeedLimited(data)
    }
  })

  useQuery({
    queryKey: 'getTransferInfo',
    queryFn: TorrClient.getTransferInfo,
    onSuccess: (data) => {
      setDownSpeed(formatBytes(data.dl_info_speed, {suffix: '/s'}))
      setDownLimit(formatBytes(data.dl_rate_limit, {suffix: '/s'}))
      setUpSpeed(formatBytes(data.up_info_speed, {suffix: '/s'}))
      setUpLimit(formatBytes(data.up_rate_limit, {suffix: '/s'}))
    },
    refetchInterval: (props.refetchInterval && props.refetchInterval > 0)
      ? props.refetchInterval
      : 1000
  })

  return (
    <Box
      backgroundColor={'none'}
      rounded={6}
      width={"100%"}
    >
      <Flex
        p={2}
        mt={3}
      >
        <Tooltip
          hasArrow
          placement={'bottom'}
          label={'Global Download Speed'}
          fontSize={'md'}
          openDelay={500}
          >
          <Flex>
            <IconContext.Provider value={{ size: '1.5em' }}>
              <Box color={'blue.500'} margin={'0.4em'} style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <IoDownload/>
              </Box>
            </IconContext.Provider>
            <Stat>
              <StatNumber fontSize={'1rem'}>
                {downSpeed}
              </StatNumber>
              <StatHelpText textColor={isSpeedLimited ? 'yellow.500' : 'gray.500'}>
                {`≤ ${downLimit}`}
              </StatHelpText>
            </Stat>
          </Flex>
        </Tooltip>
        <Spacer/>
        <Tooltip
          hasArrow
          placement={'bottom'}
          label={'Global Upload Speed'}
          fontSize={'md'}
          openDelay={500}
        >
        <Flex flexDirection={'row-reverse'}>
            <IconContext.Provider value={{ size: '1.5em' }}>
              <Box color={'green.500'} margin={'0.4em'} style={{display: 'inline-block', verticalAlign: 'middle'}}>
                <IoCloudUpload/>
              </Box>
            </IconContext.Provider>
            <Stat>
              <StatNumber textAlign={'right'} fontSize={'1rem'}>
                {upSpeed}
              </StatNumber>
              <StatHelpText textAlign={'right'} textColor={isSpeedLimited ? 'yellow.500' : 'gray.500'}>
                {`≤ ${upLimit}`}
              </StatHelpText>
            </Stat>
          </Flex>
        </Tooltip>
      </Flex>
    </Box>
  )
}