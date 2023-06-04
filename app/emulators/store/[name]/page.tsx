'use client'

import { getMods } from '@/src/gamebanaApi'
import { useEffect, useState } from 'react'
import { ApiResponse } from '@/src/gamebanana/types'
import { Header } from '@/app/emulators/[name]/header'
import { AppContext, useAppContext } from '@/src/context/appContext'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import { ModContext, useModContext } from '@/src/context/modContext'

const range = (start: number, end: number) => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}

export default function Page() {
    const [apiResponse, setApiResponse] = useState<ApiResponse>()
    const [pageLoaded, setPageLoaded] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const { setAlert } = useAppContext(AppContext)
    const { emulatorState } = useEmulatorChoiceContext(EmulatorChoiceContext)
    const { localMods } = useModContext(ModContext)

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setApiResponse(await getMods({ _nPage: pageLoaded }))
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [pageLoaded])

    if (!apiResponse) {
        return <></>
    }

    return (
        <>
            <Header title={'Browsing Gamebanana store'} />
            <div className={'flex items-center content-center justify-center'}>
                <div className="join">
                    {range(
                        1,
                        Math.ceil(
                            apiResponse._aMetadata._nRecordCount / apiResponse._aMetadata._nPerpage
                        )
                    ).map((num, i) => (
                        <button
                            key={'pagination-' + i}
                            className={
                                'join-item btn' +
                                (pageLoaded === num ? ' ' + 'btn-active' : '') +
                                (loading ? ' ' + 'btn-disabled' : '')
                            }
                            onClick={() => setPageLoaded(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className={'flex flex-row flex-wrap'}>
                    {apiResponse._aRecords.map((modRecord) => (
                        <div
                            key={modRecord._idRow}
                            className="card p-2 basis-1/5 w-96 bg-base-300 shadow-xl odd:bg-base-100"
                        >
                            <figure className={'h-96'}>
                                <img
                                    className={'object-fill'}
                                    src={
                                        modRecord._aPreviewMedia._aImages[0]._sBaseUrl +
                                        '/' +
                                        modRecord._aPreviewMedia._aImages[0]._sFile
                                    }
                                    alt="Shoes"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{modRecord._sName}</h2>
                                <p>
                                    {' '}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block w-8 h-8 stroke-current"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        ></path>
                                    </svg>{' '}
                                    {modRecord._nLikeCount} likes{' '}
                                </p>
                                <div className={'flex justify-evenly'}>
                                    <button className="btn btn-primary">Install in Yuzu</button>
                                    <button className="btn btn-primary">Install in Ryujinx</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
