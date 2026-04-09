import { Badge } from '@/components/ui/badge';
import { RISK_COLORS, RISK_LABELS } from '@/shared/constants';
import type { RiskLevel } from '@/shared/types';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
    level: RiskLevel;
    className?: string;
    score?: number;
}

export const RiskBadge = ({ level, score, className }: RiskBadgeProps) => {
    return (
        <Badge
            variant="outline"
            className={cn(
                "font-medium border shadow-sm",
                RISK_COLORS[level],
                className
            )}
        >
            {RISK_LABELS[level]} {score !== undefined ? `(${score}%)` : ''}
        </Badge>
    );
};
