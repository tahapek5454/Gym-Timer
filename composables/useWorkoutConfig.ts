export interface SetConfig {
  duration: number      // seconds, 0 = unlimited
  restDuration: number  // seconds, rest after this set
}

export interface SuperSet {
  sets: SetConfig[]
  restAfterSuperSet: number  // seconds, rest after this super set completes
}

export interface WorkoutConfig {
  superSets: SuperSet[]
  soundMode: 'voice' | 'music' | 'off'
}

const createDefaultSet = (): SetConfig => ({
  duration: 45,
  restDuration: 30
})

const createDefaultSuperSet = (): SuperSet => ({
  sets: [createDefaultSet(), createDefaultSet(), createDefaultSet()],
  restAfterSuperSet: 120
})

const createDefaultConfig = (): WorkoutConfig => ({
  superSets: [createDefaultSuperSet()],
  soundMode: 'voice'
})

export const useWorkoutConfig = () => {
  const config = useState<WorkoutConfig>('workoutConfig', () => createDefaultConfig())

  const addSuperSet = () => {
    config.value.superSets.push(createDefaultSuperSet())
  }

  const removeSuperSet = (index: number) => {
    if (config.value.superSets.length > 1) {
      config.value.superSets.splice(index, 1)
    }
  }

  const addSet = (superSetIndex: number) => {
    config.value.superSets[superSetIndex].sets.push(createDefaultSet())
  }

  const removeSet = (superSetIndex: number, setIndex: number) => {
    if (config.value.superSets[superSetIndex].sets.length > 1) {
      config.value.superSets[superSetIndex].sets.splice(setIndex, 1)
    }
  }

  const applyToAllSets = (superSetIndex: number, setIndex: number) => {
    const source = config.value.superSets[superSetIndex].sets[setIndex]
    config.value.superSets[superSetIndex].sets.forEach((set, i) => {
      if (i !== setIndex) {
        set.duration = source.duration
        set.restDuration = source.restDuration
      }
    })
  }

  const resetConfig = () => {
    config.value = createDefaultConfig()
  }

  const totalSetsCount = computed(() => {
    return config.value.superSets.reduce((sum, ss) => sum + ss.sets.length, 0)
  })

  return {
    config,
    addSuperSet,
    removeSuperSet,
    addSet,
    removeSet,
    applyToAllSets,
    resetConfig,
    totalSetsCount
  }
}
