import React from 'react'
import { Zap, UsersRound, Rocket, Activity, TrendingUp, TrendingDown} from 'lucide-react'
import RevenueChart from "@/components/dashboard/OverviewChart"
import SprintProgress from "@/components/dashboard/SprintProgress"
import TeamActivity from '@/components/dashboard/TeamActivity'
import RecentDeployments from "@/components/dashboard/RecentDeployments"
import FeatureAdoption from "@/components/dashboard/FeatureAdoption"



export default function page() {
  return (
    <div>
      <div className='flex flex-col  rounded-2xl bg-linear-to-br from-primary to-secondary from-25%  to-85% sm:p-8 p-4'>
        <span className=' text-2xl font-bold tracking-tight sm:text-3xl text-white'>Good morning, Amirali</span>
        <span className='mt-1 text-sm text-white/70' >Here's what's happening with your product today.</span>
        <div className='mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4  *:rounded-xl *:bg-white/10 *:p-2 *:sm:p-4 *:backdrop-blur-sm *:transition-colors *:hover:bg-white/15'>
          <div className='text-white/60'>
            <div className='flex items-center gap-2 mb-2'>
              <Zap  className='size-3 sm:size-4 '/>
              <span className='text-[10px]  sm:text-xs font-medium'>MRR</span>
            </div>
            <span className=' text-xl sm:text-2xl font-bold text-white'>$48.2k</span>
            <div className='mt-1 flex items-center gap-1'>
              <TrendingUp className=' size-3'/>
              <span className=' text-[9px]  sm:text-xs font-medium text-[#34d399]'>+12.4%</span>
              <span className=' text-[9px]  sm:text-xs text-white/80!'>vs last month</span>
            </div>
          </div>
          <div className='text-white/60'>
            <div className='flex items-center gap-2 mb-2'>
              <UsersRound  className='size-3 sm:size-4 ' />
              <span className='text-[10px] sm:text-xs font-medium'>Active Users</span>
            </div>
            <span className=' text-xl sm:text-2xl font-bold text-white'>12,847</span>
            <div className='mt-1 flex items-center gap-1'>
              <TrendingUp className=' size-3'/>
              <span className=' text-[9px]  sm:text-xs font-medium text-[#34d399]'>+8.2%</span>
              <span className=' text-[9px]  sm:text-xs text-white/80!'>vs last month</span>
            </div>
          </div>
          <div className='text-white/60'>
            <div className='flex items-center gap-2 mb-2'>
              <Rocket  className='size-3 sm:size-4 '/>
              <span className='text-[10px] sm:text-xs font-medium'>Deployments</span>
            </div>
            <span className=' text-xl sm:text-2xl font-bold text-white'>342</span>
            <div className='mt-1 flex items-center gap-1'>
              <TrendingUp className=' size-3'/>
              <span className=' text-[9px]  sm:text-xs font-medium text-[#34d399]'>+24.1%</span>
              <span className=' text-[9px]  sm:text-xs text-white/80!'>vs last month</span>
            </div>
          </div>
          <div className='text-white/60'>
            <div className='flex items-center gap-2 mb-2'>
              <Activity  className='size-3 sm:size-4 ' />
              <span className='text-[10px] sm:text-xs font-medium'>Uptime</span>
            </div>
            <span className=' text-xl sm:text-2xl font-bold text-white'>96.98%</span>
            <div className='mt-1 flex items-center gap-1'>
              <TrendingUp className=' size-3'/>
              <span className=' text-[9px]  sm:text-xs font-medium text-[#34d399]'>+2.02%</span>
              <span className=' text-[9px]  sm:text-xs text-white/70!'>vs last month</span>
            </div>
          </div>
          
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <RevenueChart />
        <div className='col-span-full flex flex-col gap-4 xl:col-span-5'>
          <SprintProgress />
          <TeamActivity />
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <RecentDeployments />
        <FeatureAdoption />
      </div>
    </div>


  )
}
