"use client";

import { Fragment } from 'react'
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react'
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAuthContext } from "@contexts/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Header() {
  const { signOut } = useAuthContext();
  const pathname = usePathname();

  return (
    <>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
        </div>

        <div className="flex py-1 px-[135px] items-center justify-center border border-solid border-gray-400 rounded-md">
          <button className="flex p-1 pr-2 rounded-md text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.2649 13.9304L11.1429 9.8403C11.9734 8.67171 12.4041 7.1956 12.1888 5.62723C11.8196 2.98252 9.66632 0.891363 6.99006 0.645344C3.36019 0.276315 0.284031 3.35155 0.65317 7.01109C0.899263 9.65579 2.99105 11.8392 5.63655 12.2082C7.20539 12.4235 8.68195 11.993 9.85089 11.1627L13.9422 15.2527C14.1268 15.4372 14.4036 15.4372 14.5882 15.2527L15.2342 14.6069C15.4187 14.4224 15.4187 14.1149 15.2649 13.9304ZM2.46809 6.4271C2.46809 4.24368 4.25227 2.46004 6.43634 2.46004C8.62042 2.46004 10.4046 4.24368 10.4046 6.4271C10.4046 8.61052 8.62042 10.3942 6.43634 10.3942C4.25227 10.3942 2.46809 8.64127 2.46809 6.4271Z" fill="#349989" />
            </svg>
          </button>
          <input
            type="text"
            className="flex bg-transparent focus:outline-none p-2 w-[100px] text-teal-600"
            placeholder="Search Floz"
          />
        </div>

        <div className="flex items-center justify-between">
          {/* <div className="inline-flex rounded-md border-gray-200 mx-2" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-s-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.43082 0.954108L9.8462 5.56949C9.90774 5.75411 10.0924 5.84642 10.277 5.84642H14.8924C15.3539 5.84642 15.5385 6.4618 15.1693 6.73872L11.4154 9.50795C11.2616 9.63103 11.2 9.84642 11.2616 10.031L13.0462 14.7695C13.1693 15.2003 12.7077 15.5695 12.3385 15.2926L8.30774 12.2772C8.1539 12.1541 7.93851 12.1541 7.7539 12.2772L3.69236 15.2926C3.32313 15.5695 2.83082 15.2003 2.98467 14.7695L4.70774 10.031C4.76928 9.84642 4.70774 9.63103 4.5539 9.50795L0.80005 6.73872C0.430819 6.4618 0.646204 5.84642 1.07697 5.84642H5.69236C5.90774 5.84642 6.06159 5.78488 6.12313 5.56949L7.56928 0.923338C7.69236 0.492569 8.30774 0.523338 8.43082 0.954108Z" fill="#747474"/>
            </svg>
            </button>

            <button type="button" className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-e-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.91538 3.23047H10.0846C10.3154 3.23047 10.4769 3.53047 10.2923 3.73816L6.3 8.63047C6.16154 8.81508 5.86154 8.81508 5.72307 8.63047L1.68461 3.73816C1.52308 3.53047 1.66154 3.23047 1.91538 3.23047Z" fill="#747474"/>
            </svg>
            </button>
          </div>

          <div className="mx-2 flex items-center">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M6 2C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6ZM19 12.4773C19 12.7407 18.7862 12.9545 18.5227 12.9545H13.2727C13.0971 12.9545 12.9545 13.0971 12.9545 13.2727V18.5227C12.9545 18.7862 12.7407 19 12.4773 19H11.5227C11.2593 19 11.0455 18.7862 11.0455 18.5227V13.2727C11.0455 13.0971 10.9029 12.9545 10.7273 12.9545H5.47727C5.21382 12.9545 5 12.7407 5 12.4773V11.5227C5 11.2602 5.21477 11.0455 5.47727 11.0455H10.7273C10.9029 11.0455 11.0455 10.9029 11.0455 10.7273V5.47727C11.0455 5.21477 11.2602 5 11.5227 5H12.4773C12.7407 5 12.9545 5.21382 12.9545 5.47727V10.7273C12.9545 10.9029 13.0971 11.0455 13.2727 11.0455H18.5227C18.7852 11.0455 19 11.2602 19 11.5227V12.4773Z" fill="#747474"/>
              </svg>
            </button>
          </div>

          <div className="mx-2 flex items-center">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.1078 17.5386H10.8001C10.4309 17.5386 10.1539 17.2616 10.1539 16.8924V16.2001C10.1539 14.2616 11.4001 12.5078 13.2462 11.8616C13.8001 11.677 14.3078 11.3539 14.7232 10.8924C17.0309 8.12318 14.9078 4.80011 12.1385 4.7078C11.1232 4.66165 10.1539 5.03088 9.41547 5.72319C8.81547 6.27703 8.44624 6.96934 8.35393 7.75395C8.30778 8.03088 8.03085 8.26164 7.66162 8.26164H5.35393C4.93855 8.26164 4.61547 7.93857 4.66162 7.52318C4.84624 5.76934 5.63085 4.20011 6.87701 2.95396C8.35393 1.56935 10.2462 0.830886 12.277 0.87704C16.1078 1.0155 19.2462 4.15396 19.3847 7.98472C19.5232 11.2155 17.5385 14.1232 14.5385 15.2309C14.1232 15.4155 13.8462 15.7386 13.8462 16.1539V16.8462C13.8462 17.2616 13.477 17.5386 13.1078 17.5386ZM13.8464 22.3847C13.8464 22.754 13.5233 23.077 13.1541 23.077H10.8464C10.4772 23.077 10.1541 22.754 10.1541 22.3847V20.077C10.1541 19.7078 10.4772 19.3847 10.8464 19.3847H13.1541C13.5233 19.3847 13.8464 19.7078 13.8464 20.077V22.3847Z" fill="#747474"/>
              </svg>
            </button>
          </div>

          <div className="mx-2 flex items-center">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.6001 14.9536L19.8924 13.5229C19.9847 13.0152 20.0308 12.4613 20.0308 11.9536C20.0308 11.4459 19.9847 10.8921 19.8924 10.3844L21.6001 8.95362C22.1539 8.49208 22.3385 7.66131 21.9693 7.01516L21.2308 5.6767C20.9539 5.21516 20.4462 4.93824 19.8924 4.93824C19.7077 4.93824 19.5231 4.98439 19.3847 5.03054L17.3077 5.81516C16.477 5.0767 15.5539 4.56901 14.6308 4.24593L14.2616 2.0767C14.1231 1.33824 13.477 0.922852 12.7385 0.922852H11.2616C10.5231 0.922852 9.87698 1.33824 9.73851 2.0767L9.36928 4.19977C8.3539 4.52285 7.47698 5.0767 6.64621 5.76901L4.61544 4.98439C4.43082 4.93824 4.29236 4.89208 4.10775 4.89208C3.5539 4.89208 3.04621 5.169 2.76928 5.63054L2.03082 6.92285C1.66159 7.56901 1.80005 8.39977 2.40005 8.86131L4.10775 10.2921C4.01544 10.7998 3.96928 11.3536 3.96928 11.8613C3.96928 12.4152 4.01544 12.9229 4.10775 13.4305L2.40005 14.8613C1.84621 15.3229 1.66159 16.1536 2.03082 16.7998L2.76928 18.1844C3.04621 18.6459 3.5539 18.9228 4.10775 18.9228C4.29236 18.9228 4.47698 18.8767 4.61544 18.8305L6.69236 18.0459C7.52313 18.7844 8.44621 19.2921 9.36928 19.6152L9.73851 21.8305C9.87698 22.569 10.477 23.0767 11.2616 23.0767H12.7385C13.477 23.0767 14.1231 22.5229 14.2616 21.7844L14.6308 19.569C15.6924 19.1998 16.6154 18.6459 17.4462 17.8613L19.3847 18.6459C19.5693 18.6921 19.7539 18.7382 19.9385 18.7382C20.4924 18.7382 21.0001 18.4613 21.277 17.9998L21.9693 16.7998C22.3385 16.2459 22.1539 15.4152 21.6001 14.9536ZM12.0459 17.1234C9.2767 17.1234 7.01517 14.8619 7.01517 12.0465C7.01517 9.23113 9.23055 6.96959 12.0459 6.96959C14.8613 6.96959 17.0767 9.23113 17.0767 12.0465C17.0767 14.8619 14.8152 17.1234 12.0459 17.1234ZM13.3844 8.30706H11.2613C10.9383 8.30706 10.6613 8.49168 10.569 8.7686L9.27673 12.0917C9.18442 12.3224 9.36904 12.5994 9.64596 12.5994H11.8152L11.0306 15.3686C10.9383 15.6455 11.2613 15.784 11.446 15.5994L14.7229 11.7686C14.9536 11.5378 14.769 11.1686 14.446 11.1686H12.8306L14.2613 8.90706C14.3998 8.67629 14.2152 8.35321 13.9383 8.35321H13.3844V8.30706Z" fill="#747474"/>
              </svg>
            </button>
          </div> */}


          <div className="mx-2 flex items-center">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.2305 15.2312H20.9998C20.1229 15.2312 19.3844 14.4928 19.3844 13.6158V8.30802C19.3844 4.10793 15.8767 0.738638 11.6305 0.923257C7.66131 1.10788 4.61516 4.52333 4.61516 8.53879V13.662C4.61516 14.5389 3.8767 15.2312 2.99977 15.2312H2.76901C1.75362 15.2312 0.922852 16.1082 0.922852 17.1236V17.8159C0.922852 18.139 1.24593 18.4621 1.61516 18.4621H22.3844C22.7536 18.4621 23.0767 18.139 23.0767 17.7697V17.0774C23.0767 16.062 22.2459 15.2312 21.2305 15.2312ZM14.261 20.3078H9.73797C9.46104 20.3078 9.23027 20.5847 9.27643 20.8617C9.5072 22.154 10.661 23.0771 11.9995 23.0771C13.338 23.0771 14.4918 22.1078 14.7226 20.8617C14.7687 20.5847 14.538 20.3078 14.261 20.3078Z" fill="#747474" />
              </svg>
            </button>
          </div>

          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="relative flex rounded-full p-2 bg-teal-600 text-sm focus:outline-none">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.3845 13.2307V13.9076C15.3845 14.7076 14.7075 15.3845 13.9075 15.3845H2.09216C1.29216 15.3845 0.615234 14.7076 0.615234 13.9076V13.2307C0.615234 11.446 2.70754 10.3384 4.67677 9.47681L4.86139 9.3845C5.01523 9.32297 5.16908 9.32297 5.32293 9.41527C6.12293 9.93835 7.01523 10.2153 7.96908 10.2153C8.92293 10.2153 9.846 9.90758 10.6152 9.41527C10.7691 9.32297 10.9229 9.32297 11.0768 9.3845L11.2614 9.47681C13.2922 10.3384 15.3845 11.4153 15.3845 13.2307ZM7.99987 0.615234C10.0306 0.615234 11.6614 2.43062 11.6614 4.67678C11.6614 6.92294 10.0306 8.73833 7.99987 8.73833C5.9691 8.73833 4.33833 6.92294 4.33833 4.67678C4.33833 2.43062 5.9691 0.615234 7.99987 0.615234Z" fill="white" />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      onClick={signOut}
                      className={classNames(active ? 'bg-gray-100 cursor-pointer' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer')}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <nav className="bg-white border-b-2 border-green">
        <div className="flex flex-wrap items-center justify-left mx-auto px-4">
          <Link href={`/dashboard/home`} className="font-bold text-black text-lg font-['Segoe UI'] leading-[27px] mr-6">
            FLOZ
          </Link>

          <div className="w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:mt-0">
              <li>
                <Link href={`/dashboard/home`} className={pathname.search("/home") !== -1 ? 'block text-black px-3 py-2 nav-active' : 'block text-black px-3 py-2'}>Home</Link>
              </li>

              <li>
                <Link href={`/dashboard/project`} className={pathname.search("/project") !== -1 ? 'block text-black px-3 py-2 nav-active' : 'block text-black px-3 py-2'} aria-current="page">Project</Link>
              </li>

              <li>
                <Link href={'/dashboard/calendar'} className={pathname.search("/calendar") !== -1 ? 'block text-black px-3 py-2 nav-active' : 'block text-black px-3 py-2'} aria-current="page">Calender</Link>
              </li>

              <li>
                <Link href={'/dashboard/people'} className={pathname.search("/people") !== -1 ? 'block text-black px-3 py-2 nav-active' : 'block text-black px-3 py-2'} aria-current="page">People</Link>
              </li>

              {/* <li>
                <a href="#" className="block text-black px-3 py-2" aria-current="page">More</a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>


      {/* <nav className="bg-white shadow">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href={`/home/`} className="font-extrabold text-indigo-500">
                Floz Cost
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={signOut}
              >
                <ArrowRightOnRectangleIcon
                  className="-ml-0.5 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </nav> */}
    </>
  );
}
